"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var telegram_chat_client_1 = require("./core/chat-client/telegram-chat-client");
var logging_1 = __importDefault(require("./core/util/logging"));
var sample_root_1 = require("./modules/sample-root");
var convo_manager_1 = require("./core/convo-engine/convo-manager");
dotenv.config();
var apiKey = process.env.BOT_TOKEN;
if (apiKey === undefined) {
    var missingApiKeyErrorMessage = '.env file is either not set up or does not contain BOT_TOKEN field';
    logging_1.default.fatal(missingApiKeyErrorMessage);
    throw new Error(missingApiKeyErrorMessage);
}
var client = telegram_chat_client_1.telegramClient(apiKey);
logging_1.default.debug("Initialized telegram client, attempting to run modules");
client.runModules([sample_root_1.sampleModuleData], convo_manager_1.convoManagerConstructor);
//# sourceMappingURL=index.js.map