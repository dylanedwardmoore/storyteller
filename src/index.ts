import { telegramClient } from './core/chat-client/telegram-chat-client'
import { convoManagerConstructor } from './core/convo-engine/convo-manager'
import storytellerContentConfigurations from './storyteller-config'
import { readAuthFromEnvFile } from './core/util/config/read-from-env'
import { chatClient } from './core/chat-client/chat-client'
import log from './core/util/logging'

const auth = readAuthFromEnvFile()
const client = chatClient(auth)
log.debug(`Initialized telegram client, attempting to run modules`)

client.runModule(storytellerContentConfigurations, convoManagerConstructor)
