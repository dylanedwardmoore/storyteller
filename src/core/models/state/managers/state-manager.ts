import { UserId, StateVariable, InitialUserState } from "../state";
import { ConvoSegmentPath } from "../../convo-engine/convo-graph/convo-path";
import { Nominal } from "../../common/common-types";
import ConvoSegment from "../../convo-engine/convo-graph/convo-segment";
import ConvoModule from "../../convo-engine/convo-graph/convo-module";
import HistoryManager from "./history-manager";
import { Either } from "fp-ts/lib/Either";


export interface StateNavigationStoreFunctions {
    setCurrentConvoSegmentPath: (path: ConvoSegmentPath) => void
    getCurrentConvoSegmentPath: () => ConvoSegmentPath
}

export interface StateVariableStoreFunctions {
    setStateVariable: (key: string, newValue: StateVariable) => void
    getStateVariable: (key: string) => StateVariable
}

export interface StateNavigationFunctions {
    safelyGetConvoSegment: (path: ConvoSegmentPath) => Either<Error, ConvoSegment>,
    getCurrentConvoSegment: () => ConvoSegment
}

// export type StateDependant<T> = (stateVariableFunctions: StateVariableStoreFunctions) => T

// export type StateDependantNominal<K, T> = Nominal<K, StateDependant<T>>

export type StateManager = StateVariableStoreFunctions & StateNavigationFunctions & StateNavigationStoreFunctions

export type StateManagerConstructor = {
    getOrInitUserState: (rootModule: ConvoModule, onInitState: InitialUserState, historyManager: HistoryManager) => StateManager
}

export default StateManager
