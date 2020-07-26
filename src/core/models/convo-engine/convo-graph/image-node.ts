import { Filepath } from './expression'
import { Nominal } from '../../common/common-types'

export type ImageNodeNominalType = 'image-node'

type ImageNode = Nominal<
    ImageNodeNominalType,
    {
        src: Filepath
    }
>

export default ImageNode
