import RenderInChat from "../../chat-client/render-interface";
import ConvoModule from "../convo-graph/convo-module";
import { InitialUserState } from "../../state/state";
interface ConvoManager {
    respondToUserInput: (userId: string, userInput: string, chatRenderFunctions: RenderInChat) => void;
}
export declare type ConvoManagerConstructor = (rootModule: ConvoModule, initialState: InitialUserState) => ConvoManager;
export default ConvoManager;
