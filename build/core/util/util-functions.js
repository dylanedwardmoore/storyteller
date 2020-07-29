"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateFilePath = exports.evaluateNumber = exports.evaluateCondition = exports.evaluateText = exports.evaluateStateUpdate = exports.noDuplicates = exports.concatArraysReducer = exports.onError = exports.getNominalValue = void 0;
var Either_1 = require("fp-ts/lib/Either");
var logging_1 = __importDefault(require("./logging"));
var Either_2 = require("fp-ts/lib/Either");
function getNominalValue(nominal) {
    return nominal;
}
exports.getNominalValue = getNominalValue;
function onError(message, defaultReturnValue) {
    return function (error) {
        logging_1.default.trace(message + "\nError: " + error);
        return defaultReturnValue;
    };
}
exports.onError = onError;
function concatArraysReducer(accumulator, current) {
    return __spreadArrays(accumulator, current);
}
exports.concatArraysReducer = concatArraysReducer;
function noDuplicates(arr) {
    return Array.from(new Set(arr));
}
exports.noDuplicates = noDuplicates;
function evaluateExpression(expression, onError, stateInstance) {
    var generalErrorHandling = function (e) {
        return e instanceof Error ? e : new Error('unknown error');
    };
    var resultOrError = Either_2.tryCatch(function () {
        var test = expression.stateDependentResult(stateInstance);
        return expression.stateDependentResult(stateInstance);
    }, generalErrorHandling);
    var guarenteedResult = Either_1.fold(onError, function (val) { return val; })(resultOrError);
    return guarenteedResult;
}
exports.evaluateStateUpdate = function (stateUpdateExpression, onError, stateInstance) { return evaluateExpression(stateUpdateExpression, onError, stateInstance); };
exports.evaluateText = function (textExpression, onError, stateInstance) { return evaluateExpression(textExpression, onError, stateInstance); };
exports.evaluateCondition = function (conditionExpression, onError, stateInstance) { return evaluateExpression(conditionExpression, onError, stateInstance); };
exports.evaluateNumber = function (numberExpression, onError, stateInstance) { return evaluateExpression(numberExpression, onError, stateInstance); };
exports.evaluateFilePath = function (filepathExpression, onError, stateInstance) { return evaluateExpression(filepathExpression, onError, stateInstance); };
//# sourceMappingURL=util-functions.js.map