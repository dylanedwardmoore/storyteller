import { ConvoManagerConstructor } from '../convo-engine/managers/convo-manager'
import ConvoModule from '../convo-engine/convo-graph/convo-module'
import { GeneralizedState } from '../state/state'
import { AbsoluteConvoSegmentPath } from '../convo-engine/convo-graph/convo-path'
import { TelegramAuth, ChatClientAuth } from './auth'
import { StorageManagerAuth } from '../storage/auth'


export type StorytellerConfig = {
    rootModule: ConvoModule
    initialState: GeneralizedState
    startingConvoSegmentPath: AbsoluteConvoSegmentPath
}

export interface ChatClient {
    runModule: (
        config: StorytellerConfig,
        convoManagerConstructor: ConvoManagerConstructor
    ) => void
}

type Auth<T extends ChatClientAuth> = {
    clientAuth: T,
    storageAuth: StorageManagerAuth
}

export type ChatClientConstructor<T extends ChatClientAuth> = (auth: Auth<T>) => ChatClient

export default ChatClient
