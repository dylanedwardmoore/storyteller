import RenderInChat from '../../chat-client/render-interface'
import ConvoModule from '../convo-graph/convo-module'
import { Stores } from '../../state/state'

interface ConvoManager {
    respondToUserInput: (
        userId: string,
        userInput: string,
        chatRenderFunctions: RenderInChat
    ) => void
}

export type ConvoManagerConstructor = (
    rootModule: ConvoModule,
    initialState: Stores
) => ConvoManager

export default ConvoManager
