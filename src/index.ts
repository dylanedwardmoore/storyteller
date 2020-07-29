import * as dotenv from 'dotenv'
import { telegramClient } from './core/chat-client/telegram-chat-client'
import log from './core/util/logging'
import { convoManagerConstructor } from './core/convo-engine/convo-manager'
import storytellerContentConfigurations from './storyteller-config'

dotenv.config()

const apiKey = process.env.BOT_TOKEN

if (apiKey === undefined) {
    const missingApiKeyErrorMessage =
        '.env file is either not set up or does not contain BOT_TOKEN field'
    log.fatal(missingApiKeyErrorMessage)
    throw new Error(missingApiKeyErrorMessage)
}

const client = telegramClient(apiKey)
log.debug(`Initialized telegram client, attempting to run modules`)

client.runModule(storytellerContentConfigurations, convoManagerConstructor)
