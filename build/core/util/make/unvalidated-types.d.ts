import ConvoModule from "../../models/convo-engine/convo-graph/convo-module";
export declare type _ModuleId = string;
export declare type _ConvoSegmentId = string;
export declare type _ConvoSegmentPath = string[];
export declare type _Text = string;
export declare type _Filepath = string;
export declare type _ImageNode = {
    type: "image";
    src: string;
};
export declare type _TextNode = {
    type: "text";
    text: _Text;
};
export declare type _ConvoNode = _ImageNode | _TextNode;
export declare type _Condition = boolean;
export declare type _ConvoAction = {
    type: 'goto';
    path: _ConvoSegmentPath;
};
export declare type _Action = _ConvoAction;
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
};
export declare type _ConvoModule = {
    id: _ModuleId;
    submodules?: ConvoModule[];
    convoSegments?: _ConvoSegment[];
};
