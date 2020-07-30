import { ChatClientConstructor } from '../models/chat-client/chat-client'
import ConvoManager from '../models/convo-engine/managers/convo-manager'
import RenderInChat from '../models/chat-client/render-interface'
import log from '../util/logging'
import { Stores } from '../models/state/state'
import { State } from '../../state/state-config'
const Keyboard = require('telegraf-keyboard')
const Telegraf = require('telegraf')
const session = require('telegraf/session')

type TelegrafContext = any
type TelegrafBot = any

function getKeyboardWithButtons(buttons: string[]) {
    const keyboardOptions = {
        inline: false,
        duplicates: false,
        newline: false,
    }
    const keyboard = new Keyboard(keyboardOptions)
    buttons.map(text => keyboard.add(text))
    return keyboard
}

function renderWithContext(ctx: TelegrafContext): RenderInChat {
    return {
        replyText: (text, buttons) => {
            log.debug('reply in chat with the text message: ', text)
            ctx.replyWithHTML(text, getKeyboardWithButtons(buttons).draw())
        },
        replyImage: (src, buttons) => {
            log.debug('reply in chat with the image: ', src)
            ctx.replyWithPhoto(
                { url: `${src}`, filename: `photo.jpg` },
                getKeyboardWithButtons(buttons).draw()
            )
        },
    }
}

export const telegramClient: ChatClientConstructor = apiKey => {
    const bot: TelegrafBot = new Telegraf(apiKey)
    return {
        runModule: (storytellerConfig, convoManagerConstructor) => {
            bot.use(session())

            const initStateStores: Stores = {
                variables: storytellerConfig.initialState as State,
                currentConvoSegmentPath:
                    storytellerConfig.startingConvoSegmentPath,
            }

            const convoManager: ConvoManager = convoManagerConstructor(
                storytellerConfig.rootModule,
                initStateStores
            )

            bot.on('text', (ctx: any) => {
                log.debug(`received user input`)
                const renderFunctions: RenderInChat = renderWithContext(ctx)
                convoManager.respondToUserInput(
                    ctx.from.id,
                    ctx.message.text,
                    renderFunctions
                )
            })
            bot.on('message', (ctx: { reply: (arg0: string) => any }) => {
                log.debug(`received user input as message other than text`)
                ctx.reply('Only text messages please')
            })
            log.debug(`telegram client is configured and waiting for messages.`)
            bot.launch()
        },
    }
}
