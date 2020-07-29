/*
 * Note: The underscore '_' here is used to disabiguate
 * these unvalidated types from
 * their validated counterparts elsewhere
 */

import ConvoModule from '../../models/convo-engine/convo-graph/convo-module'
import { StateDependentResult } from '../../models/state/state'
import { State } from '../../../state/state-config'

// TODO: investigate if this reference to config needs to be here...
export type ResultOrStateDependentResult<T> = T | StateDependentResult<T, State>

export type _ModuleId = string

export type _ConvoSegmentId = string

export type _ConvoSegmentPath = string[]

export type _Text = ResultOrStateDependentResult<string>

export type _Filepath = ResultOrStateDependentResult<string>

export type _StateUpdate = ResultOrStateDependentResult<Partial<State>>

export type _ImageNode = {
    type: 'image'
    src: string
}

export type _TextNode = {
    type: 'text'
    text: _Text
}

export type _ConvoNode = _ImageNode | _TextNode

export type _Condition = ResultOrStateDependentResult<boolean>

export type _UpdateStateAction = {
    type: 'update-state'
    update: _StateUpdate
}

export type _StartConvoAction = {
    type: 'goto'
    path: _ConvoSegmentPath
}

export type _Action = _StartConvoAction | _UpdateStateAction

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
    default?: _Logic[]
}

export type _ConvoModule = {
    id: _ModuleId
    submodules?: ConvoModule[]
    convoSegments?: _ConvoSegment[]
}
