import { ConvoSegmentId } from './convo-segment';
import { ConvoModuleId } from './convo-module';
export declare type ModulePath = ConvoModuleId[];
export declare type ConvoSegmentPath = Readonly<{
    id: ConvoSegmentId;
    parentModules?: ModulePath;
}>;
export declare type AbsoluteConvoSegmentPath = Required<ConvoSegmentPath>;
