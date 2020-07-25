import { Nominal, ErrorHandler } from "../models/common/common-types";
import { Text, Condition, Number, Filepath } from "../models/convo-engine/convo-graph/expression";
export declare function getNominalValue<K, T>(nominal: Nominal<K, T>): T;
export declare function onError<T>(message: string, defaultReturnValue: T): (error: Error) => T;
export declare const evaluateText: (textExpression: Text, onError: ErrorHandler<string>) => string;
export declare const evaluateCondition: (conditionExpression: Condition, onError: ErrorHandler<boolean>) => boolean;
export declare const evaluateNumber: (numberExpression: Number, onError: ErrorHandler<number>) => number;
export declare const evaluateFilePath: (filepathExpression: Filepath, onError: ErrorHandler<string>) => string;
