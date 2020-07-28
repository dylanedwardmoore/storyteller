import { Filepath } from './expression';
import { Nominal } from '../../common/common-types';
export declare type ImageNodeNominalType = 'image-node';
declare type ImageNode = Nominal<ImageNodeNominalType, {
    src: Filepath;
}>;
export default ImageNode;
