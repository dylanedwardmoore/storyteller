import { StateVariable, Stores } from "../state";
import { ConvoSegmentPath, AbsoluteConvoSegmentPath } from "../../convo-engine/convo-graph/convo-path";
import ConvoSegment from "../../convo-engine/convo-graph/convo-segment";
import ConvoModule from "../../convo-engine/convo-graph/convo-module";
import HistoryManager from "./history-manager";
import { Either } from "fp-ts/lib/Either";
export interface StateNavigationStoreFunctions {
    setCurrentConvoSegmentPath: (path: ConvoSegmentPath) => void;
    getCurrentConvoSegmentPath: () => AbsoluteConvoSegmentPath;
}
export interface StateVariableStoreFunctions {
    setStateVariable: (key: string, newValue: StateVariable) => void;
    getStateVariable: (key: string) => StateVariable;
}
export interface StateNavigationFunctions {
    safelyGetConvoSegment: (path: ConvoSegmentPath) => Either<Error, ConvoSegment>;
    getCurrentConvoSegment: () => ConvoSegment;
    getAbsolutePath: (path: ConvoSegmentPath) => AbsoluteConvoSegmentPath;
}
export declare type StateManager = StateVariableStoreFunctions & StateNavigationFunctions & StateNavigationStoreFunctions;
export declare type StateManagerConstructor = {
    getOrInitUserState: (rootModule: ConvoModule, onInitState: Stores, historyManager: HistoryManager) => StateManager;
};
export default StateManager;
