import ConvoNode from './convo-node';
import UserChoice from './user-choice';
import { ConvoLogic } from './convo-logic';
import { Id } from '../../common/common-types';
export declare type ConvoSegmentIdNominalType = 'convo-segment-id';
export declare type ConvoSegmentId = Id<ConvoSegmentIdNominalType>;
declare type ConvoSegment = Readonly<{
    id: ConvoSegmentId;
    convoNodes: ConvoNode[];
    choices: UserChoice[];
    defaultChoice?: ConvoLogic;
    preLogic: ConvoLogic;
    postLogic: ConvoLogic;
}>;
export default ConvoSegment;
