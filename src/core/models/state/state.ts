import { JSONValue, PlainObject, Id } from '../common/common-types'
import { ConvoSegmentPath } from '../convo-engine/convo-graph/convo-path'
import Event from '../storage/event'

export type StateVariable = JSONValue

export type UserInfo = {
    lastTextMessage: string
    userId: string
}

export const defaultUserInfo: UserInfo = {
    lastTextMessage: '',
    userId: '',
}

/*
 * To make the core agnostic from content,
 * we ignore explicit typing for state variables
 */
export type GeneralizedState = PlainObject<StateVariable>

export type GeneralizedStateInstance = Readonly<GeneralizedState>

export type GeneralizedStateUpdate = Partial<GeneralizedStateInstance>

export type UserId = string

export type NavigationStoreState = {
    currentConvoSegmentPath: Required<ConvoSegmentPath>
}

export type VariableStoreState = {
    variables: GeneralizedState & UserInfo
}

export type StateDependentResult<
    T,
    S extends GeneralizedStateInstance = GeneralizedStateInstance
> = (state: S) => Readonly<T>

export type Stores = VariableStoreState & NavigationStoreState
