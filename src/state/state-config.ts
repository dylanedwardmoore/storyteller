import { UserInfo } from '../core/models/state/state'

/*
 * Define your state type and initial user state here. This type and const
 * are referenced in ../storyteller-config.ts
 *
 */

export type State = UserInfo &
    Required<{
        // Add custom state fields here

        testValue: number
    }>

export const initialState: State = {
    lastTextMessage: '',
    testValue: 0,
}
