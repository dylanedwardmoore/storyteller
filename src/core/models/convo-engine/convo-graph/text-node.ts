import { Text } from './expression'
import { Nominal } from '../../common/common-types'

export type TextNodeNominalType = 'text-node'

type TextNode = Nominal<
    TextNodeNominalType,
    {
        text: Text
    }
>

export default TextNode
