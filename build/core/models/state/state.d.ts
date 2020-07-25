import { JSONValue, PlainObject, Id } from "../common/common-types";
import { ConvoSegmentPath } from "../convo-engine/convo-graph/convo-path";
import { EventRecord, EventRecordId } from "./event-record";
export declare type StateVariable = JSONValue;
export declare type UserIdNominalType = 'uuid';
export declare type UserId = Id<UserIdNominalType>;
export declare type NavigationStoreState = {
    currentConvoSegmentPath: Required<ConvoSegmentPath>;
};
export declare type VariableStoreState = {
    variables: PlainObject<StateVariable>;
};
export declare type UserHistoryState = {
    history: EventRecord[];
    revertedEvents: Set<EventRecordId>;
};
export declare type InitialUserState = VariableStoreState & NavigationStoreState;
