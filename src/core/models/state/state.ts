import { JSONValue, PlainObject, Id } from "../common/common-types"
import { ConvoSegmentPath } from "../convo-engine/convo-graph/convo-path"
import { EventRecord, EventRecordId } from "./event-record"


export type StateVariable = JSONValue

export type UserIdNominalType = 'uuid'

export type UserId = Id<UserIdNominalType>

export type NavigationStoreState = {
    currentConvoSegmentPath: ConvoSegmentPath
}

export type VariableStoreState = {
    variables: PlainObject<StateVariable>
}

export type UserHistoryState = {
    history: EventRecord[]
    revertedEvents: Set<EventRecordId>
}

export type InitialUserState = VariableStoreState & NavigationStoreState
