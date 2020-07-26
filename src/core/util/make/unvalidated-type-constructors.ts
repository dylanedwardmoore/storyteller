import {
    _Choice,
    _Logic,
    _Text,
    _ImageNode,
    _ConvoSegmentPath,
    _Condition,
} from './unvalidated-types'

type Identity<T> = (value: T) => T

const identity = <T>(val: T) => val

export const choice: Identity<_Choice> = identity

export const logic: Identity<_Logic> = identity

export const text: Identity<_Text> = identity

export const image: Identity<_ImageNode> = identity

export const convoSegmentPath: Identity<_ConvoSegmentPath> = identity

export const condition: Identity<_Condition> = identity
