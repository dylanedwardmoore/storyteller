"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var telegram_chat_client_1 = require("./core/chat-client/telegram-chat-client");
var logging_1 = __importDefault(require("./core/util/logging"));
var convo_manager_1 = require("./core/convo-engine/convo-manager");
var storyteller_config_1 = __importDefault(require("./storyteller-config"));
dotenv.config();
var apiKey = process.env.BOT_TOKEN;
if (apiKey === undefined) {
    var missingApiKeyErrorMessage = '.env file is either not set up or does not contain BOT_TOKEN field';
    logging_1.default.fatal(missingApiKeyErrorMessage);
    throw new Error(missingApiKeyErrorMessage);
}
var client = telegram_chat_client_1.telegramClient(apiKey);
logging_1.default.debug("Initialized telegram client, attempting to run modules");
client.runModule(storyteller_config_1.default, convo_manager_1.convoManagerConstructor);
//# sourceMappingURL=index.js.map