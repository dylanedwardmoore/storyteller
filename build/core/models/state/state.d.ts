import { JSONValue, PlainObject, Id } from "../common/common-types";
import { ConvoSegmentPath } from "../convo-engine/convo-graph/convo-path";
import { EventRecord, EventRecordId } from "./event-record";
export declare type StateVariable = JSONValue;
export declare type GeneralizedState = PlainObject<StateVariable>;
export declare type UserIdNominalType = 'uuid';
export declare type UserId = Id<UserIdNominalType>;
export declare type NavigationStoreState = {
    currentConvoSegmentPath: Required<ConvoSegmentPath>;
};
export declare type VariableStoreState = {
    variables: GeneralizedState;
};
export declare type UserHistoryState = {
    history: EventRecord[];
    revertedEvents: Set<EventRecordId>;
};
export declare type Stores = VariableStoreState & NavigationStoreState;
