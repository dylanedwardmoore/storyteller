import { ConvoManagerConstructor } from '../convo-engine/managers/convo-manager';
import ConvoModule from '../convo-engine/convo-graph/convo-module';
import { GeneralizedState } from '../state/state';
import { AbsoluteConvoSegmentPath } from '../convo-engine/convo-graph/convo-path';
declare type APIKey = string;
export declare type StorytellerConfig = {
    rootModule: ConvoModule;
    initialState: GeneralizedState;
    startingConvoSegmentPath: AbsoluteConvoSegmentPath;
};
export interface ChatClient {
    runModule: (config: StorytellerConfig, convoManagerConstructor: ConvoManagerConstructor) => void;
}
export declare type ChatClientConstructor = (key: APIKey) => ChatClient;
export default ChatClient;
