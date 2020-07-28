import { StateManagerConstructor } from '../models/state/managers/state-manager';
import ConvoModule from '../models/convo-engine/convo-graph/convo-module';
import { ConvoSegmentPath, AbsoluteConvoSegmentPath } from '../models/convo-engine/convo-graph/convo-path';
import { Either } from 'fp-ts/lib/Either';
import ConvoSegment from '../models/convo-engine/convo-graph/convo-segment';
export declare const safelyGetConvoSegment: (rootModule: ConvoModule, path: ConvoSegmentPath, currentPath: AbsoluteConvoSegmentPath) => Either<Error, ConvoSegment>;
export declare const stateManagerConstructor: StateManagerConstructor;
