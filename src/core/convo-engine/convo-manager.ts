import { ConvoManagerConstructor } from "../models/convo-engine/managers/convo-manager";
import StateManager from "../models/state/managers/state-manager";
import UserChoice from "../models/convo-engine/convo-graph/user-choice";
import { evaluateText, evaluateCondition, getNominalValue, onError, evaluateFilePath } from "../util/util-functions";
import log from "../util/logging";
import { ConvoLogic, ConvoLogicAction } from "../models/convo-engine/convo-graph/convo-logic";
import ConvoNode from "../models/convo-engine/convo-graph/convo-node";
import RenderInChat from "../models/chat-client/render-interface";
import { stateManagerConstructor } from "./state-manager";
import HistoryManager from "../models/state/managers/history-manager";
import { UserId, InitialUserState } from "../models/state/state";
import ConvoModule from "../models/convo-engine/convo-graph/convo-module";


const choiceMatchesUserInput: (userInput: string) => (choice: UserChoice) => boolean = userInput => choice => {
    // Any choice that thows an error will resolve by default to the empty string and thus never match user's input
    const errorHandler = onError(`Choice text expression resolves to error.\nUser input = ${userInput}`, '')
    return evaluateText(choice.text, errorHandler) === userInput
}

const displayConvoNode: (chatRenderFunctions: RenderInChat, keyboardButtons: string[]) => (convoNode: ConvoNode) => void = (chatRenderFunctions, keyboardButtons) => convoNode => {
    switch (convoNode.__TYPE__) {
        case 'image-node':
            const errorHandler = onError(`Error evaluating image source`, 'SERVER ERROR')
            chatRenderFunctions.replyImage(evaluateFilePath(convoNode.src, errorHandler), keyboardButtons)
            break
        case 'text-node':
            const replyText = evaluateText(convoNode.text, onError('Error evaluating convoNode text', 'SERVER ERROR'))
            log.debug(`send reply`, replyText)
            chatRenderFunctions.replyText(replyText, keyboardButtons)
            break
        default:
            log.trace('Error! This should be unreachable code')
            break
    }
}

interface ExecuteActionParams {
    action: ConvoLogicAction,
    stateManager: StateManager, 
    chatRenderFunctions: RenderInChat
}

const keyboardButtonFromChoice: (choice: UserChoice) => string = choice => {
    const errorHandler = onError(`Choice text expression resolves to error.`, 'SERVER ERROR')
    return evaluateText(choice.text, errorHandler)
}

const executeAction: (params: ExecuteActionParams) => void = params => {
    const { action, stateManager, chatRenderFunctions} = params
    log.debug(`Executing action`, action)
    switch(action.type) {
        case 'start-convo-segment':
            // TODO: Add support for pre convo logic
            log.debug(`Set convo path to `, action.path)
            stateManager.setCurrentConvoSegmentPath(action.path)
            const convoSegment = stateManager.getCurrentConvoSegment()
            const keyboardButtons = convoSegment.choices.map(keyboardButtonFromChoice)
            convoSegment.convoNodes.forEach(displayConvoNode(chatRenderFunctions, keyboardButtons))
            // TODO: Add support for post convo logic
            break
        // case 'update-value-data-action':
            // log.debug(`Update value`)
            // TODO: Add support for variables
            // break
        default:
            log.trace('Error! This should be unreachable code')
            break
    }

}

interface ExecuteConvoLogicParams {
    logic: ConvoLogic
    stateManager: StateManager, 
    chatRenderFunctions: RenderInChat
}

const executeConvoLogic: (logic: ExecuteConvoLogicParams) => void = params => {
    const { logic, stateManager, chatRenderFunctions} = params
    logic.forEach(conditionalLogic => {
        log.debug(`Executing logic`, conditionalLogic)
        // Assume any condition that evaluates to an error evalutes to 'false'
        const errorHandler = onError(`Condition expression resolves to error.\n This will be evaluated to 'false' by default.`, false)
        const curriedExecuteAction = (action: ConvoLogicAction) => executeAction({action, stateManager, chatRenderFunctions})
        if (evaluateCondition(conditionalLogic.if, errorHandler)) {
            log.debug(`Condition evalutes to 'true', handling 'then'`)
            conditionalLogic.do.forEach(curriedExecuteAction)
        } else {
            log.debug(`Condition evalutes to 'false', handling 'otherwise'`)
            conditionalLogic.otherwise.forEach(curriedExecuteAction)
        }
    })
}

type GetOrInitStateManagerParams = {
    userId: string,
    cache: Record<string, StateManager>,
    module: ConvoModule,
    initialState: InitialUserState,
    historyManager: HistoryManager
}

const getOrInitStateManager: (params: GetOrInitStateManagerParams) => StateManager = (params) => {
    const { userId, cache, module, initialState, historyManager } = params
    if (cache[userId] !== undefined) {
        log.debug(`Found state manager in cache for userId '${userId}'`)
        return cache[userId]
    } else {
        log.debug(`Did not find state manager in cache for userId '${userId}', creating one now with initial state`, initialState)
        const stateManager: StateManager = stateManagerConstructor.getOrInitUserState(module, initialState, historyManager)
        cache[userId] = stateManager
        return stateManager
    }
}

export const convoManagerConstructor: ConvoManagerConstructor = (module, initialState) => {
    const cache: Record<string, StateManager> = {}
    return {
        respondToUserInput: (userId, userInput, chatRenderFunctions) => {
            // init state manager or pull from cache
            // init navigation manager or pull from cache 
            const historyManager: HistoryManager = {}
            
            const stateManager: StateManager = getOrInitStateManager({cache, userId, module, initialState, historyManager})
            
            // Find the matching user choice for the given user input at the current convoNode
            log.debug(`processing user input ${userInput} for convo segment with path `, stateManager.getCurrentConvoSegmentPath)
            const currentConvoSegment = stateManager.getCurrentConvoSegment()
            const selectedUserChoice = currentConvoSegment.choices.find(choiceMatchesUserInput(userInput))
            if (selectedUserChoice !== undefined) {
                log.debug(`User input ${userInput} matches the choice `, selectedUserChoice)
                // Do any logic associated with the selected user choice
                executeConvoLogic({ logic: selectedUserChoice.logic, stateManager, chatRenderFunctions })
            } else {
                log.debug(`User input ${userInput} matches NO choices`)
                // Respond that the user input does not match any of the available user choices for this convo node
            }
        }
    }
}
