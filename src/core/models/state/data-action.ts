import { JSONValue } from '../common/common-types'

export type UpdateValue = {
    type: 'update-value-data-action'
    key: string
    value: JSONValue
}

type DataAction = Readonly<UpdateValue>

export default DataAction
