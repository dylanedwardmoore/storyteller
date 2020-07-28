import { Text } from './expression';
import { Nominal } from '../../common/common-types';
export declare type TextNodeNominalType = 'text-node';
declare type TextNode = Nominal<TextNodeNominalType, {
    text: Text;
}>;
export default TextNode;
