import { ChatClientConstructor } from '../models/chat-client/chat-client'
import { ChatClientAuth } from '../models/chat-client/auth'
import { telegramClient } from './telegram-chat-client'

export const chatClient: ChatClientConstructor<ChatClientAuth> = auth => {
    switch (auth.clientAuth.type) {
        case 'telegram':
            return telegramClient(auth)
    }
}
