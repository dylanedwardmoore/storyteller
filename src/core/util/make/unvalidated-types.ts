/*
 * Note: The underscore '_' here is used to disabiguate
 * these unvalidated types from
 * their validated counterparts elsewhere
 */

import ConvoModule from '../../models/convo-engine/convo-graph/convo-module'
import UserChoice from '../../models/convo-engine/convo-graph/user-choice'

export type _ModuleId = string

export type _ConvoSegmentId = string

export type _ConvoSegmentPath = string[]

export type _Text = string

export type _Filepath = string

export type _ImageNode = {
    type: 'image'
    src: string
}

export type _TextNode = {
    type: 'text'
    text: _Text
}

export type _ConvoNode = _ImageNode | _TextNode

export type _Condition = boolean

// export type _DataAction = {}

export type _ConvoAction = {
    type: 'goto'
    path: _ConvoSegmentPath
}

export type _Action = _ConvoAction

export type _Logic = {
    if?: _Condition
    do: _Action[]
    otherwise?: _Action[]
}

export type _Choice = {
    text: _Text
    logic: _Logic[]
}

export type _ConvoSegment = {
    id: _ConvoSegmentId
    convo: _ConvoNode[]
    choices: _Choice[]
}

export type _ConvoModule = {
    id: _ModuleId
    submodules?: ConvoModule[]
    convoSegments?: _ConvoSegment[]
}
