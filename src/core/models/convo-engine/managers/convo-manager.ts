import RenderInChat from '../../chat-client/render-interface'
import ConvoModule from '../convo-graph/convo-module'
import { Stores } from '../../state/state'
import { StorageManagerAuth } from '../../storage/auth'

interface ConvoManager {
    respondToUserInput: (
        userId: string,
        userInput: string,
        chatRenderFunctions: RenderInChat
    ) => void
}

export type ConvoManagerConfig = {
    rootModule: ConvoModule
    initialState: Stores
    auth: StorageManagerAuth
}

export type ConvoManagerConstructor = (
    config: ConvoManagerConfig
) => ConvoManager

export default ConvoManager
