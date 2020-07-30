import { JSONValue, PlainObject, Id } from '../common/common-types'
import { ConvoSegmentPath } from '../convo-engine/convo-graph/convo-path'
import { EventRecord, EventRecordId } from './event-record'

export type StateVariable = JSONValue

// TODO: refactor this to make user info more separate from state?
export type UserInfo = {
    lastTextMessage: string
}

/*
 * To make the core agnostic from content,
 * we normalize all incoming state types to
 * GeneralizedState, as defined here.
 */
export type GeneralizedState = PlainObject<StateVariable>

export type GeneralizedStateInstance = Readonly<GeneralizedState>

export type GeneralizedStateUpdate = Partial<GeneralizedStateInstance>

export type UserIdNominalType = 'uuid'

export type UserId = Id<UserIdNominalType>

export type NavigationStoreState = {
    currentConvoSegmentPath: Required<ConvoSegmentPath>
}

export type VariableStoreState = {
    variables: GeneralizedState & UserInfo
}

export type UserHistoryState = {
    history: EventRecord[]
    revertedEvents: Set<EventRecordId>
}

export type StateDependentResult<
    T,
    S extends GeneralizedStateInstance = GeneralizedStateInstance
> = (state: S) => Readonly<T>

export type Stores = VariableStoreState & NavigationStoreState
