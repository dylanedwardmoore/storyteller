import Event from "../../models/storage/event"
import { Stores } from "../../models/state/state"


const chronologicalEventSort = (event1: Event, event2: Event) => event1.timestamp.getMilliseconds() - event2.timestamp.getMilliseconds()

const applyEvent: (state: Stores, event: Event) => Stores = (state, event) => {
    switch (event.type) {
        case 'update-convo-segment-path-event':
            return {
                ...state,
                currentConvoSegmentPath: event.update
            }
        case 'update-state-event':
            return {
                ...state,
                variables: {
                    ...state.variables,
                    ...event.update.stateDependentResult
                }
            }
        case 'update-user-info':
            return {
                ...state,
                variables: {
                    ...state.variables,
                    ...event.update
                }
            }
    }
}

export const applyEventsToState: (initialState: Stores, events: Event[]) => Stores = (initialState, events) => {
    return events.sort(chronologicalEventSort)
        .reduce(applyEvent, initialState)
}