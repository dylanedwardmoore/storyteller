import { StateUpdate } from "../convo-engine/convo-graph/expression"
import { AbsoluteConvoSegmentPath } from "../convo-engine/convo-graph/convo-path"
import { UserInfo } from "../state/state"
import { Timestamp } from "../common/common-types"


type EventID = string

export type EventUpdate = StateUpdate | AbsoluteConvoSegmentPath | Partial<UserInfo>

export type EventType = 'update-state-event' | 'update-convo-segment-path-event' | 'update-user-info'

type RevertableEvent<T extends EventType, U extends EventUpdate> = {
    eventId: EventID
    userId: string
    type: T
    update: U
    undoUpdate: U
    timestamp: Timestamp
    reverts?: EventID 
}

type UpdateStateEvent = RevertableEvent<'update-state-event', StateUpdate>

type UpdateConvoSegmentPathEvent = RevertableEvent<'update-convo-segment-path-event', AbsoluteConvoSegmentPath>

type UpdateUserInfoEvent = RevertableEvent<'update-user-info', Partial<UserInfo>>

type Event = UpdateStateEvent | UpdateConvoSegmentPathEvent | UpdateUserInfoEvent

export default Event
