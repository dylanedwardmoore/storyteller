import { Nominal, ErrorHandler } from '../models/common/common-types'
import {
    Expression,
    Text,
    Condition,
    Number,
    Filepath,
    StateUpdate,
} from '../models/convo-engine/convo-graph/expression'
import { fold, Either } from 'fp-ts/lib/Either'
import log from './logging'
import {
    GeneralizedStateInstance,
    GeneralizedStateUpdate,
} from '../models/state/state'
import { tryCatch } from 'fp-ts/lib/Either'

export function getNominalValue<K, T>(nominal: Nominal<K, T>): T {
    return nominal
}

export function onError<T>(
    message: string,
    defaultReturnValue: T
): (error: Error) => T {
    return (error: Error) => {
        log.trace(`${message}\nError: ${error}`)
        return defaultReturnValue
    }
}

export function concatArraysReducer<T>(accumulator: T[], current: T[]): T[] {
    return [...accumulator, ...current]
}

export function noDuplicates<T>(arr: T[]): T[] {
    return Array.from(new Set(arr))
}

function evaluateExpression<
    K,
    T extends Readonly<boolean | string | number | GeneralizedStateUpdate>
>(
    expression: Expression<K, T>,
    onError: ErrorHandler<T>,
    stateInstance: GeneralizedStateInstance
): T {
    const generalErrorHandling = (e: any) =>
        e instanceof Error ? e : new Error('unknown error')
    const resultOrError: Either<Error, Readonly<T>> = tryCatch(() => {
        const test = expression.stateDependentResult(stateInstance)
        return expression.stateDependentResult(stateInstance)
    }, generalErrorHandling)
    const guarenteedResult: T = fold(onError, (val: T) => val)(resultOrError)
    return guarenteedResult
}

export const evaluateStateUpdate = (
    stateUpdateExpression: StateUpdate,
    onError: ErrorHandler<GeneralizedStateUpdate>,
    stateInstance: GeneralizedStateInstance
) => evaluateExpression(stateUpdateExpression, onError, stateInstance)

export const evaluateText = (
    textExpression: Text,
    onError: ErrorHandler<string>,
    stateInstance: GeneralizedStateInstance
) => evaluateExpression(textExpression, onError, stateInstance)

export const evaluateCondition = (
    conditionExpression: Condition,
    onError: ErrorHandler<boolean>,
    stateInstance: GeneralizedStateInstance
) => evaluateExpression(conditionExpression, onError, stateInstance)

export const evaluateNumber = (
    numberExpression: Number,
    onError: ErrorHandler<number>,
    stateInstance: GeneralizedStateInstance
) => evaluateExpression(numberExpression, onError, stateInstance)

export const evaluateFilePath = (
    filepathExpression: Filepath,
    onError: ErrorHandler<string>,
    stateInstance: GeneralizedStateInstance
) => evaluateExpression(filepathExpression, onError, stateInstance)
