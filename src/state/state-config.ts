/*
 * Define your state type and initial user state here. This type and const
 * are referenced in ../storyteller-config.ts
 *
 * Note: It's recommended, though not enforced, that all state fields be required.
 * Following this convention will allow you to avoid null checks in your
 * module code.
 */

export type State = {
    testValue: number
}

export const initialState: State = {
    testValue: 0,
}
