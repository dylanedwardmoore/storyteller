import { ConvoManagerConstructor } from '../models/convo-engine/managers/convo-manager'
import StateManager from '../models/state/managers/state-manager'
import UserChoice from '../models/convo-engine/convo-graph/user-choice'
import {
    evaluateText,
    evaluateCondition,
    onError,
    evaluateFilePath,
    evaluateStateUpdate,
} from '../util/util-functions'
import log from '../util/logging'
import {
    ConvoLogic,
    ConvoLogicAction,
} from '../models/convo-engine/convo-graph/convo-logic'
import ConvoNode from '../models/convo-engine/convo-graph/convo-node'
import RenderInChat from '../models/chat-client/render-interface'
import { stateManagerConstructor } from './state-manager'
import HistoryManager from '../models/state/managers/history-manager'
import {
    UserId,
    Stores,
    GeneralizedState,
    GeneralizedStateInstance,
} from '../models/state/state'
import ConvoModule from '../models/convo-engine/convo-graph/convo-module'

const choiceMatchesUserInput: (
    userInput: string,
    stateInstance: GeneralizedStateInstance
) => (choice: UserChoice) => boolean = (userInput, stateInstance) => choice => {
    // Any choice that thows an error will resolve by default to the empty string and thus never match user's input
    const errorHandler = onError(
        `Choice text expression resolves to error.\nUser input = ${userInput}`,
        ''
    )
    return evaluateText(choice.text, errorHandler, stateInstance) === userInput
}

const displayConvoNode: (
    chatRenderFunctions: RenderInChat,
    keyboardButtons: string[],
    stateInstance: Readonly<GeneralizedState>
) => (convoNode: ConvoNode) => void = (
    chatRenderFunctions,
    keyboardButtons,
    stateInstance
) => convoNode => {
    switch (convoNode.__TYPE__) {
        case 'image-node':
            const errorHandler = onError(
                `Error evaluating image source`,
                'SERVER ERROR'
            )
            chatRenderFunctions.replyImage(
                evaluateFilePath(convoNode.src, errorHandler, stateInstance),
                keyboardButtons
            )
            break
        case 'text-node':
            const replyText = evaluateText(
                convoNode.text,
                onError('Error evaluating convoNode text', 'SERVER ERROR'),
                stateInstance
            )
            log.debug(`send reply`, replyText)
            chatRenderFunctions.replyText(replyText, keyboardButtons)
            break
        default:
            log.trace('Error! This should be unreachable code')
            break
    }
}

interface ExecuteActionParams {
    action: ConvoLogicAction
    stateManager: StateManager
    chatRenderFunctions: RenderInChat
}

const keyboardButtonFromChoice: (
    stateInstance: GeneralizedState
) => (choice: UserChoice) => string = stateInstance => choice => {
    const errorHandler = onError(
        `Choice text expression resolves to error.`,
        'SERVER ERROR'
    )
    return evaluateText(choice.text, errorHandler, stateInstance)
}

const keyboardButtonsFromChoices: (
    stateInstance: GeneralizedStateInstance,
    choices: UserChoice[]
) => string[] = (stateInstance, choices) => {
    const keyboardButtonFromChoiceWithState = keyboardButtonFromChoice(
        stateInstance
    )
    return choices.map(keyboardButtonFromChoiceWithState)
}

const executeAction: (params: ExecuteActionParams) => void = params => {
    const { action, stateManager, chatRenderFunctions } = params
    log.debug(`Executing action`, action)
    switch (action.type) {
        case 'start-convo-segment':
            // TODO: Add support for pre convo logic
            log.debug(`Set convo path to `, action.path)
            stateManager.setCurrentConvoSegmentPath(action.path)
            const convoSegment = stateManager.getCurrentConvoSegment()
            const keyboardButtons = keyboardButtonsFromChoices(
                stateManager.getState(),
                convoSegment.choices
            )
            convoSegment.convoNodes.forEach(
                displayConvoNode(
                    chatRenderFunctions,
                    keyboardButtons,
                    stateManager.getState()
                )
            )
            break
        case 'update-state-data-action':
            log.debug(`Update state with state updates: `, action.updates)
            const errorHandler = onError(
                `Error evaluating state update expression, this is likely a problem with logic in the module's definition.\nThe user state will NOT be updated.`,
                {}
            )
            const evaluatedStateUpdate = evaluateStateUpdate(
                action.updates,
                errorHandler,
                stateManager.getState()
            )
            stateManager.updateState(evaluatedStateUpdate)
            break
        default:
            log.trace('Error! This should be unreachable code')
            break
    }
}

interface ExecuteConvoLogicParams {
    logic: ConvoLogic
    stateManager: StateManager
    chatRenderFunctions: RenderInChat
}

const executeConvoLogic: (logic: ExecuteConvoLogicParams) => void = params => {
    const { logic, stateManager, chatRenderFunctions } = params
    logic.forEach(conditionalLogic => {
        log.debug(`Executing logic`, conditionalLogic)
        // Assume any condition that evaluates to an error evalutes to 'false'
        const errorHandler = onError(
            `Condition expression resolves to error.\n This will be evaluated to 'false' by default.`,
            false
        )
        const curriedExecuteAction = (action: ConvoLogicAction) =>
            executeAction({ action, stateManager, chatRenderFunctions })
        if (
            evaluateCondition(
                conditionalLogic.if,
                errorHandler,
                stateManager.getState()
            )
        ) {
            log.debug(`Condition evalutes to 'true', handling 'then'`)
            conditionalLogic.do.forEach(curriedExecuteAction)
        } else {
            log.debug(`Condition evalutes to 'false', handling 'otherwise'`)
            conditionalLogic.otherwise.forEach(curriedExecuteAction)
        }
    })
}

type GetOrInitStateManagerParams = {
    userId: string
    cache: Record<string, StateManager>
    module: ConvoModule
    initialState: Stores
    historyManager: HistoryManager
}

const getOrInitStateManager: (
    params: GetOrInitStateManagerParams
) => StateManager = params => {
    const { userId, cache, module, initialState, historyManager } = params
    if (cache[userId] !== undefined) {
        log.debug(`Found state manager in cache for userId '${userId}'`)
        return cache[userId]
    } else {
        log.debug(
            `Did not find state manager in cache for userId '${userId}', creating one now with initial state`,
            initialState
        )
        const initialStateWithId = {
            ...initialState,
            variables: {
                ...initialState.variables,
                userId,
            },
        }
        log.fatal('initial state', initialStateWithId, userId)
        const stateManager: StateManager = stateManagerConstructor.getOrInitStateManager(
            module,
            initialStateWithId,
            historyManager
        )
        cache[userId] = stateManager
        return stateManager
    }
}

export const convoManagerConstructor: ConvoManagerConstructor = (
    module,
    initialState
) => {
    const cache: Record<string, StateManager> = {}
    return {
        respondToUserInput: (userId, userInput, chatRenderFunctions) => {
            // init state manager or pull from cache
            // init navigation manager or pull from cache
            const historyManager: HistoryManager = {}

            const stateManager: StateManager = getOrInitStateManager({
                cache,
                userId,
                module,
                initialState,
                historyManager,
            })

            // Find the matching user choice for the given user input at the current convoNode
            log.debug(
                `processing user input ${userInput} for convo segment with path `,
                stateManager.getCurrentConvoSegmentPath
            )
            log.debug(`updating lastTextMessage state field`)
            stateManager.updateState({ lastTextMessage: userInput })

            const currentConvoSegment = stateManager.getCurrentConvoSegment()
            const selectedUserChoice = currentConvoSegment.choices.find(
                choiceMatchesUserInput(userInput, stateManager.getState())
            )
            if (selectedUserChoice !== undefined) {
                log.debug(
                    `User input ${userInput} matches the choice `,
                    selectedUserChoice
                )
                // Do any logic associated with the selected user choice
                executeConvoLogic({
                    logic: selectedUserChoice.logic,
                    stateManager,
                    chatRenderFunctions,
                })
            } else {
                if (currentConvoSegment.defaultChoice !== undefined) {
                    log.debug(
                        `User input matches no choices, executing logic for default choice`
                    )
                    executeConvoLogic({
                        logic: currentConvoSegment.defaultChoice,
                        stateManager,
                        chatRenderFunctions,
                    })
                } else {
                    log.debug(
                        `User input ${userInput} matches NO choices and no 'defaultChoice' is defined`
                    )
                    const keyboardButtons = keyboardButtonsFromChoices(
                        stateManager.getState(),
                        currentConvoSegment.choices
                    )
                    const defaultResponse = `Sorry, I don't recognize your response of <i>${userInput}</i> right now. Try responding with one of the buttons in the chat keyboard.`
                    chatRenderFunctions.replyText(
                        defaultResponse,
                        keyboardButtons
                    )
                }
            }
        },
    }
}
