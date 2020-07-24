"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importStar(require("../util/logging"));
var Telegraf = require('telegraf');
var session = require('telegraf/session');
var Stage = require('telegraf/stage');
var Scene = require('telegraf/scenes/base');
var enter = Stage.enter, leave = Stage.leave;
function renderWithContext(ctx) {
    return {
        replyText: function (text) {
            logging_1.default.trace('reply in chat with the text message: ', text);
            ctx.reply(text);
        },
        showButtons: function (text) {
            logging_1.default.trace('display on keyboard: ', text);
        }
    };
}
function createSceneFromModule(_a, convoManagerConstructor) {
    var module = _a.module, moduleConfig = _a.moduleConfig;
    var name = moduleConfig.name, welcomeMessage = moduleConfig.welcomeMessage, farwellMessage = moduleConfig.farwellMessage, endModuleCommand = moduleConfig.endModuleCommand, initialState = moduleConfig.initialState;
    var convoManager = convoManagerConstructor(module, initialState);
    var telegrafScene = new Scene(name);
    if (welcomeMessage) {
        telegrafScene.enter(function (ctx) { return ctx.reply(welcomeMessage); });
    }
    if (farwellMessage) {
        telegrafScene.leave(function (ctx) { return ctx.reply(farwellMessage); });
    }
    telegrafScene.command(endModuleCommand, leave());
    // TODO: add in other global commands
    // if (globalCommands !== undefined) {
    //     globalCommands.forEach(({ command, effect }: CommandAndEffect) => {
    //         telegrafScene.command(command, convoManager.handleEffect(effect))
    //     })
    // }
    logging_1.default.debug("handling response");
    telegrafScene.on('text', function (ctx) {
        logging_1.default.info('respond to user input text ', ctx.message.text);
        logging_1.jsonLogger.silly('context object is ', ctx);
        var renderFunctions = renderWithContext(ctx);
        convoManager.respondToUserInput(ctx.from.username, ctx.message.text, renderFunctions);
    });
    telegrafScene.on('message', function (ctx) { return ctx.reply('Only text messages please'); });
    return telegrafScene;
}
exports.telegramClient = function (apiKey) {
    var bot = new Telegraf(apiKey);
    return {
        runModules: function (modulesData, convoManagerConstructor) {
            var scenes = modulesData.map(function (moduleData) {
                return createSceneFromModule(moduleData, convoManagerConstructor);
            });
            var stage = new Stage(scenes);
            bot.use(session());
            bot.use(stage.middleware());
            var defaultMessage = 'Try sending ';
            modulesData.forEach(function (_a) {
                var moduleOptions = _a.moduleConfig;
                bot.command(moduleOptions.startModuleCommand, function (ctx) {
                    logging_1.default.debug("start module command recieved");
                    ctx.scene.enter(moduleOptions.name);
                });
                defaultMessage += moduleOptions.startModuleCommand + ' or ';
            });
            bot.on('message', function (ctx) { return ctx.reply(defaultMessage); });
            logging_1.default.debug("telegram client is configured and waiting for messages.");
            bot.launch();
        },
    };
};
//# sourceMappingURL=telegram-chat-client.js.map