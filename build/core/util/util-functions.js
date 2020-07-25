"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateFilePath = exports.evaluateNumber = exports.evaluateCondition = exports.evaluateText = exports.onError = exports.getNominalValue = void 0;
var Either_1 = require("fp-ts/lib/Either");
var logging_1 = __importDefault(require("./logging"));
var function_1 = require("fp-ts/lib/function");
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
function evaluateExpression(nominalExpression, onError) {
    var expressionValueOrError = getNominalValue(nominalExpression);
    var evaluteExpression = Either_1.fold(onError, function_1.identity);
    return evaluteExpression(expressionValueOrError);
}
exports.evaluateText = function (textExpression, onError) { return evaluateExpression(textExpression, onError); };
exports.evaluateCondition = function (conditionExpression, onError) { return evaluateExpression(conditionExpression, onError); };
exports.evaluateNumber = function (numberExpression, onError) { return evaluateExpression(numberExpression, onError); };
exports.evaluateFilePath = function (filepathExpression, onError) { return evaluateExpression(filepathExpression, onError); };
//# sourceMappingURL=util-functions.js.map