import { ConvoManagerConstructor } from "../convo-engine/managers/convo-manager";
import ConvoModule from "../convo-engine/convo-graph/convo-module";
import { InitialUserState } from "../state/state";
declare type APIKey = string;
export declare type ChatCommand = string;
export declare type ModuleConfig = {
    initialState: InitialUserState;
};
export declare type ModuleData = {
    module: ConvoModule;
    moduleConfig: ModuleConfig;
};
export interface ChatClient {
    runModule: (module: ModuleData, convoManagerConstructor: ConvoManagerConstructor) => void;
}
export declare type ChatClientConstructor = (key: APIKey) => ChatClient;
export default ChatClient;
