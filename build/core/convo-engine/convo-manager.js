"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convoManagerConstructor = void 0;
var util_functions_1 = require("../util/util-functions");
var logging_1 = __importDefault(require("../util/logging"));
var state_manager_1 = require("./state-manager");
var choiceMatchesUserInput = function (userInput) { return function (choice) {
    // Any choice that thows an error will resolve by default to the empty string and thus never match user's input
    var errorHandler = util_functions_1.onError("Choice text expression resolves to error.\nUser input = " + userInput, '');
    return util_functions_1.evaluateText(choice.text, errorHandler) === userInput;
}; };
var displayConvoNode = function (chatRenderFunctions, keyboardButtons) { return function (convoNode) {
    switch (convoNode.__TYPE__) {
        case 'image-node':
            var errorHandler = util_functions_1.onError("Error evaluating image source", 'SERVER ERROR');
            chatRenderFunctions.replyImage(util_functions_1.evaluateFilePath(convoNode.src, errorHandler), keyboardButtons);
            break;
        case 'text-node':
            var replyText = util_functions_1.evaluateText(convoNode.text, util_functions_1.onError('Error evaluating convoNode text', 'SERVER ERROR'));
            logging_1.default.debug("send reply", replyText);
            chatRenderFunctions.replyText(replyText, keyboardButtons);
            break;
        default:
            logging_1.default.trace('Error! This should be unreachable code');
            break;
    }
}; };
var keyboardButtonFromChoice = function (choice) {
    var errorHandler = util_functions_1.onError("Choice text expression resolves to error.", 'SERVER ERROR');
    return util_functions_1.evaluateText(choice.text, errorHandler);
};
var executeAction = function (params) {
    var action = params.action, stateManager = params.stateManager, chatRenderFunctions = params.chatRenderFunctions;
    logging_1.default.debug("Executing action", action);
    switch (action.type) {
        case 'start-convo-segment':
            // TODO: Add support for pre convo logic
            logging_1.default.debug("Set convo path to ", action.path);
            stateManager.setCurrentConvoSegmentPath(action.path);
            var convoSegment = stateManager.getCurrentConvoSegment();
            var keyboardButtons = convoSegment.choices.map(keyboardButtonFromChoice);
            convoSegment.convoNodes.forEach(displayConvoNode(chatRenderFunctions, keyboardButtons));
            // TODO: Add support for post convo logic
            break;
        // case 'update-value-data-action':
        // log.debug(`Update value`)
        // TODO: Add support for variables
        // break
        default:
            logging_1.default.trace('Error! This should be unreachable code');
            break;
    }
};
var executeConvoLogic = function (params) {
    var logic = params.logic, stateManager = params.stateManager, chatRenderFunctions = params.chatRenderFunctions;
    logic.forEach(function (conditionalLogic) {
        logging_1.default.debug("Executing logic", conditionalLogic);
        // Assume any condition that evaluates to an error evalutes to 'false'
        var errorHandler = util_functions_1.onError("Condition expression resolves to error.\n This will be evaluated to 'false' by default.", false);
        var curriedExecuteAction = function (action) { return executeAction({ action: action, stateManager: stateManager, chatRenderFunctions: chatRenderFunctions }); };
        if (util_functions_1.evaluateCondition(conditionalLogic.if, errorHandler)) {
            logging_1.default.debug("Condition evalutes to 'true', handling 'then'");
            conditionalLogic.do.forEach(curriedExecuteAction);
        }
        else {
            logging_1.default.debug("Condition evalutes to 'false', handling 'otherwise'");
            conditionalLogic.otherwise.forEach(curriedExecuteAction);
        }
    });
};
var getOrInitStateManager = function (params) {
    var userId = params.userId, cache = params.cache, module = params.module, initialState = params.initialState, historyManager = params.historyManager;
    if (cache[userId] !== undefined) {
        logging_1.default.debug("Found state manager in cache for userId '" + userId + "'");
        return cache[userId];
    }
    else {
        logging_1.default.debug("Did not find state manager in cache for userId '" + userId + "', creating one now with initial state", initialState);
        var stateManager = state_manager_1.stateManagerConstructor.getOrInitUserState(module, initialState, historyManager);
        cache[userId] = stateManager;
        return stateManager;
    }
};
exports.convoManagerConstructor = function (module, initialState) {
    var cache = {};
    return {
        respondToUserInput: function (userId, userInput, chatRenderFunctions) {
            // init state manager or pull from cache
            // init navigation manager or pull from cache 
            var historyManager = {};
            var stateManager = getOrInitStateManager({ cache: cache, userId: userId, module: module, initialState: initialState, historyManager: historyManager });
            // Find the matching user choice for the given user input at the current convoNode
            logging_1.default.debug("processing user input " + userInput + " for convo segment with path ", stateManager.getCurrentConvoSegmentPath);
            var currentConvoSegment = stateManager.getCurrentConvoSegment();
            var selectedUserChoice = currentConvoSegment.choices.find(choiceMatchesUserInput(userInput));
            if (selectedUserChoice !== undefined) {
                logging_1.default.debug("User input " + userInput + " matches the choice ", selectedUserChoice);
                // Do any logic associated with the selected user choice
                executeConvoLogic({ logic: selectedUserChoice.logic, stateManager: stateManager, chatRenderFunctions: chatRenderFunctions });
            }
            else {
                logging_1.default.debug("User input " + userInput + " matches NO choices");
                // Respond that the user input does not match any of the available user choices for this convo node
            }
        }
    };
};
//# sourceMappingURL=convo-manager.js.map