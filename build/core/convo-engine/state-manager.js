"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
var util_functions_1 = require("../util/util-functions");
var logging_1 = __importDefault(require("../util/logging"));
var function_1 = require("fp-ts/lib/function");
var stateNavigationStoreFunctionsConstructor = function (initialUserState, historyManager) {
    var cache = {
        currentConvoSegmentPath: initialUserState.currentConvoSegmentPath
    };
    // Restore history to cache using history manager
    return {
        setCurrentConvoSegmentPath: function (path) { return cache.currentConvoSegmentPath = path; },
        getCurrentConvoSegmentPath: function () { return cache.currentConvoSegmentPath; }
    };
};
var stateVariableStoreFunctionsConstructor = function (initialUserState, historyManager) {
    var cache = {
        variables: initialUserState.variables
    };
    // Restore history to cache using history manager
    return {
        getStateVariable: function (key) { return cache.variables[key]; },
        setStateVariable: function (key, newValue) {
            cache.variables[key] = newValue;
        }
    };
};
var relativePathToAbsolute = function (possiblyRelativePath, currentAbsolutePath) {
    if (currentAbsolutePath.parentModules === undefined) {
        throw new Error('Current path can never be relative, parent modules must be defined.');
    }
    if (possiblyRelativePath.parentModules === undefined) {
        return __assign(__assign({}, possiblyRelativePath), { parentModules: currentAbsolutePath.parentModules });
    }
    else {
        return possiblyRelativePath;
    }
};
var safelyGetConvoSegment = function (rootModule, currentPath, path) {
    var unsafeRetreive = function (path) {
        var absolutePath = relativePathToAbsolute(path, currentPath);
        var reducer = function (parentModule, nextChildId) {
            return parentModule.submodules[util_functions_1.getNominalValue(nextChildId)];
        };
        var nestedModule = absolutePath.parentModules.reduce(reducer, rootModule);
        return nestedModule.convoSegments[path.id];
    };
    return Either_1.tryCatch(function () { return unsafeRetreive(path); }, function (e) { return (e instanceof Error ? new Error("Module path is invalid: " + path) : new Error('Unknown error while retreiving convo segment')); });
};
// Can cause terminal error
var getCurrentConvoSegment = function (rootModule, navigationStoreFunctions) {
    var currentPath = navigationStoreFunctions.getCurrentConvoSegmentPath();
    var currentConvoSegmentOrError = safelyGetConvoSegment(rootModule, currentPath, currentPath);
    var errorHandling = function (error) {
        logging_1.default.trace("Unretreivable current convo segment for current convo path: " + currentPath + "\nPlease run server with module path tests enabled to help debug this issue.");
        throw error;
    };
    var folding = Either_1.fold(errorHandling, function_1.identity);
    return folding(currentConvoSegmentOrError);
};
var stateNavigationFunctionsConstructor = function (rootModule, navigationStoreFunctions) {
    return {
        safelyGetConvoSegment: function (path) { return safelyGetConvoSegment(rootModule, path, navigationStoreFunctions.getCurrentConvoSegmentPath()); },
        getCurrentConvoSegment: function () { return getCurrentConvoSegment(rootModule, navigationStoreFunctions); }
    };
};
exports.stateManagerConstructor = {
    getOrInitUserState: function (rootModule, onInitState, historyManager) {
        var stateNavigationStoreFunctions = stateNavigationStoreFunctionsConstructor(onInitState, historyManager);
        var stateVariableStoreFunctions = stateVariableStoreFunctionsConstructor(onInitState, historyManager);
        var stateNavigationFunctions = stateNavigationFunctionsConstructor(rootModule, stateNavigationStoreFunctions);
        return __assign(__assign(__assign({}, stateNavigationStoreFunctions), stateVariableStoreFunctions), stateNavigationFunctions);
    }
};
//# sourceMappingURL=state-manager.js.map