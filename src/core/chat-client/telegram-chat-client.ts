import { ChatClientConstructor, ModuleData } from '../models/chat-client/chat-client'
import ConvoManager, { ConvoManagerConstructor } from '../models/convo-engine/managers/convo-manager'
import RenderInChat from '../models/chat-client/render-interface'
import log, { jsonLogger } from '../util/logging'
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { enter, leave } = Stage


type Scene = any

type TelegrafContext = any

function renderWithContext(ctx: TelegrafContext): RenderInChat {
    return {
        replyText: text => {
            log.debug('reply in chat with the text message: ', text)
            ctx.reply(text)
        },
        showButtons: text => {
            log.debug('display on keyboard: ', text)
        }
    }
}

function createSceneFromModule({ module, moduleConfig }: ModuleData, convoManagerConstructor: ConvoManagerConstructor): Scene {
    const { name, 
        welcomeMessage, 
        farwellMessage, 
        endModuleCommand,
        initialState } = moduleConfig
    
    const convoManager: ConvoManager = convoManagerConstructor(module, initialState)

    const telegrafScene = new Scene(name)
    
    if (welcomeMessage) {
        telegrafScene.enter((ctx: { reply: (arg0: string) => any }) => ctx.reply(welcomeMessage))
    }

    if (farwellMessage) {
        telegrafScene.leave((ctx: { reply: (arg0: string) => any }) => ctx.reply(farwellMessage))
    }

    telegrafScene.command(endModuleCommand, leave())
    
    // TODO: add in other global commands
    // if (globalCommands !== undefined) {
    //     globalCommands.forEach(({ command, effect }: CommandAndEffect) => {
    //         telegrafScene.command(command, convoManager.handleEffect(effect))
    //     })
    // }
    log.debug(`handling response`)
    telegrafScene.on('text', (ctx: any) => {
        log.debug('respond to user input text ', ctx.message.text)
        const renderFunctions: RenderInChat = renderWithContext(ctx)
        convoManager.respondToUserInput(ctx.from.username, ctx.message.text, renderFunctions)
    })
    telegrafScene.on('message', (ctx: { reply: (arg0: string) => any }) => ctx.reply('Only text messages please'))
    return telegrafScene
}

export const telegramClient: ChatClientConstructor = (apiKey) => {
    const bot = new Telegraf(apiKey)
    return {
        runModules: (modulesData, convoManagerConstructor) => {
            const scenes = modulesData.map(moduleData => {
                return createSceneFromModule(moduleData, convoManagerConstructor)
            })
            const stage = new Stage(scenes)
            bot.use(session())
            bot.use(stage.middleware())
            let defaultMessage = 'Try sending '
            modulesData.forEach(({ moduleConfig: moduleOptions }: ModuleData) => {
                bot.command(moduleOptions.startModuleCommand, (ctx: { scene: { enter: (arg0: string) => any } }) => {
                    log.debug(`start module command recieved`)
                    ctx.scene.enter(moduleOptions.name)})
                defaultMessage += moduleOptions.startModuleCommand + ' or '
            })
            bot.on('message', (ctx: { reply: (arg0: string) => any }) => ctx.reply(defaultMessage))
            log.debug(`telegram client is configured and waiting for messages.`)
            bot.launch()
        },
    }
}
