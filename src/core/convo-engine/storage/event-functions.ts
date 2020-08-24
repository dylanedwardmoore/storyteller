import Event, { UpdateUserInfoEvent, UpdateStateEvent, UpdateConvoSegmentPathEvent, EventID, IDGenerator, EventUpdate, EventType, RevertableEvent } from '../../models/storage/event'
import { Stores, GeneralizedState, UserInfo, GeneralizedStateUpdate } from '../../models/state/state'
import { AbsoluteConvoSegmentPath } from '../../models/convo-engine/convo-graph/convo-path'
import { Timestamp } from '../../models/common/common-types'
import { StateUpdate } from '../../models/convo-engine/convo-graph/expression'
import { getDiff, applyDiff } from 'recursive-diff';



type Update<T> = {
    diffBefore: T,
    diffAfter: T
}

type EventConstructorParams<T, U> = Update<T> & {
    eventIdGen: IDGenerator,
    userId: string,
    type: T,
    timestamp: Timestamp,
    reverts: EventID | undefined
}

const chronologicalEventSort = (event1: Event, event2: Event) =>
    event1.timestamp.getMilliseconds() - event2.timestamp.getMilliseconds()

const applyEvent: (state: Stores, event: Event) => Stores = (state, event) => {

    getDiff()
    switch (event.type) {
        case 'update-convo-segment-path-event':
            return {
                ...state,
                currentConvoSegmentPath: event.update,
            }
        case 'update-state-event':
            return {
                ...state,
                variables: {
                    ...state.variables,
                    ...event.update.stateDependentResult,
                },
            }
        case 'update-user-info':
            return {
                ...state,
                variables: {
                    ...state.variables,
                    ...event.update,
                },
            }
    }
}

export const applyEventsToState: (
    initialState: Stores,
    events: Event[]
) => Stores = (initialState, events) => {
    return events.sort(chronologicalEventSort).reduce(applyEvent, initialState)
}


export const eventFromDiff: <T extends EventType, U extends EventUpdate>(params: EventConstructorParams<T, U>) => RevertableEvent<T, U> = params => {
    const { eventIdGen, type, userId, diffBefore, diffAfter, timestamp, reverts } = params
 
    return {
        eventId: eventIdGen(),
        userId,
        type,
        update: diffBefore,
        undoUpdate: diffAfter,
        timestamp,
        reverts
    }
}
