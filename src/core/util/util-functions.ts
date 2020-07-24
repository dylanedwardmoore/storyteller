import { Nominal, ErrorHandler } from "../models/common/common-types";
import { Expression, Text, Condition, Number, Filepath } from "../models/convo-engine/convo-graph/expression";
import { fold, Either } from "fp-ts/lib/Either";
import { TextNodeNominalType } from "../models/convo-engine/convo-graph/text-node";
import log from "./logging";
import { identity } from "fp-ts/lib/function";


export function getNominalValue<K, T>(nominal: Nominal<K, T>): T {
    return nominal
}

export function onError<T>(message: string, defaultReturnValue: T): (error: Error) => T {
    return (error: Error) => {
        log.trace(`${message}\nError: ${error}`)
        return defaultReturnValue
    }
}

function evaluateExpression<K, T extends Readonly<boolean | string | number>>(nominalExpression: Expression<K, T>, onError: ErrorHandler<T>): T {
    const expressionValueOrError = getNominalValue(nominalExpression)
    const evaluteExpression: (val: Either<Error, Readonly<T>>) => Readonly<T> = fold(onError, identity)
    return evaluteExpression(expressionValueOrError)
}

export const evaluateText = (textExpression: Text, onError: ErrorHandler<string>) => evaluateExpression(textExpression, onError)

export const evaluateCondition = (conditionExpression: Condition, onError: ErrorHandler<boolean>) => evaluateExpression(conditionExpression, onError)

export const evaluateNumber = (numberExpression: Number, onError: ErrorHandler<number>) => evaluateExpression(numberExpression, onError)

export const evaluateFilePath = (filepathExpression: Filepath, onError: ErrorHandler<string>) => evaluateExpression(filepathExpression, onError)
