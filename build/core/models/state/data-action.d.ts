import { StateUpdate } from '../convo-engine/convo-graph/expression';
export declare type UpdateState = {
    type: 'update-state-data-action';
    updates: StateUpdate;
};
declare type DataAction = Readonly<UpdateState>;
export default DataAction;
