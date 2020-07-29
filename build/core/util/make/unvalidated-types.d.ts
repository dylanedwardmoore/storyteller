import ConvoModule from '../../models/convo-engine/convo-graph/convo-module';
import { StateDependentResult } from '../../models/state/state';
import { State } from '../../../state/state-config';
export declare type ResultOrStateDependentResult<T> = T | StateDependentResult<T, State>;
export declare type _ModuleId = string;
export declare type _ConvoSegmentId = string;
export declare type _ConvoSegmentPath = string[];
export declare type _Text = ResultOrStateDependentResult<string>;
export declare type _Filepath = ResultOrStateDependentResult<string>;
export declare type _StateUpdate = ResultOrStateDependentResult<Partial<State>>;
export declare type _ImageNode = {
    type: 'image';
    src: string;
};
export declare type _TextNode = {
    type: 'text';
    text: _Text;
};
export declare type _ConvoNode = _ImageNode | _TextNode;
export declare type _Condition = ResultOrStateDependentResult<boolean>;
export declare type _UpdateStateAction = {
    type: 'update-state';
    update: _StateUpdate;
};
export declare type _StartConvoAction = {
    type: 'goto';
    path: _ConvoSegmentPath;
};
export declare type _Action = _StartConvoAction | _UpdateStateAction;
export declare type _Logic = {
    if?: _Condition;
    do: _Action[];
    otherwise?: _Action[];
};
export declare type _Choice = {
    text: _Text;
    logic: _Logic[];
};
export declare type _ConvoSegment = {
    id: _ConvoSegmentId;
    convo: _ConvoNode[];
    choices: _Choice[];
    default?: _Logic[];
};
export declare type _ConvoModule = {
    id: _ModuleId;
    submodules?: ConvoModule[];
    convoSegments?: _ConvoSegment[];
};
