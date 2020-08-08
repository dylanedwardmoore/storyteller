import {
    UserId,
    StateVariable,
    Stores,
    GeneralizedState,
    GeneralizedStateUpdate,
    GeneralizedStateInstance,
} from '../state'
import {
    ConvoSegmentPath,
    AbsoluteConvoSegmentPath,
} from '../../convo-engine/convo-graph/convo-path'
import { Nominal } from '../../common/common-types'
import ConvoSegment from '../../convo-engine/convo-graph/convo-segment'
import ConvoModule from '../../convo-engine/convo-graph/convo-module'
import HistoryManager from './history-manager'
import { Either } from 'fp-ts/lib/Either'

export interface StateNavigationStoreFunctions {
    setCurrentConvoSegmentPath: (path: ConvoSegmentPath) => void
    getCurrentConvoSegmentPath: () => AbsoluteConvoSegmentPath
}

export interface StateVariableStoreFunctions {
    getState: () => GeneralizedStateInstance
    updateState: (updates: GeneralizedStateUpdate) => void
}

export interface StateNavigationFunctions {
    safelyGetConvoSegment: (
        path: ConvoSegmentPath
    ) => Either<Error, ConvoSegment>
    getCurrentConvoSegment: () => ConvoSegment
    getAbsolutePath: (path: ConvoSegmentPath) => AbsoluteConvoSegmentPath
}

// export type StateDependant<T> = (stateVariableFunctions: StateVariableStoreFunctions) => T

// export type StateDependantNominal<K, T> = Nominal<K, StateDependant<T>>

export type StateManager = StateVariableStoreFunctions &
    StateNavigationFunctions &
    StateNavigationStoreFunctions

export type StateManagerConstructor = {
    getOrInitStateManager: (
        rootModule: ConvoModule,
        onInitState: Stores,
        historyManager: HistoryManager
    ) => StateManager
}

export default StateManager
