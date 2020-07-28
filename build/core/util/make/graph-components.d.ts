import ConvoModule from '../../models/convo-engine/convo-graph/convo-module';
import { _ConvoModule, _ConvoSegmentPath } from './unvalidated-types';
import { AbsoluteConvoSegmentPath } from '../../models/convo-engine/convo-graph/convo-path';
export declare function absoluteConvoSegmentPath(content: _ConvoSegmentPath): AbsoluteConvoSegmentPath;
export declare function module(content: _ConvoModule): ConvoModule;
