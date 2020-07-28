import { StateUpdate } from '../convo-engine/convo-graph/expression'

export type UpdateState = {
    type: 'update-state-data-action'
    updates: StateUpdate
}

type DataAction = Readonly<UpdateState>

export default DataAction
