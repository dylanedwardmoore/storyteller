import ConvoSegment from "./convo-segment";
import { Id } from "../../common/common-types";
export declare type ConvoModuleIdNominalType = 'convo-module-id';
export declare type ConvoModuleId = Id<ConvoModuleIdNominalType>;
export declare type ConvoModule = Readonly<{
    id: ConvoModuleId;
    submodules: Record<string, ConvoModule>;
    convoSegments: Record<string, ConvoSegment>;
}>;
export default ConvoModule;
