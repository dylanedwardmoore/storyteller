import { ConvoSegmentPath } from './convo-path';
export declare type StartConvoSegment = {
    type: 'start-convo-segment';
    path: ConvoSegmentPath;
};
declare type ConvoAction = Readonly<StartConvoSegment>;
export default ConvoAction;
