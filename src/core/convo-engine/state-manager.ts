import { StateManagerConstructor, StateNavigationFunctions, StateNavigationStoreFunctions, StateVariableStoreFunctions } from "../models/state/managers/state-manager";
import ConvoModule, { ConvoModuleId } from "../models/convo-engine/convo-graph/convo-module";
import HistoryManager from "../models/state/managers/history-manager";
import { NavigationStoreState, InitialUserState, VariableStoreState } from "../models/state/state";
import { ConvoSegmentPath } from "../models/convo-engine/convo-graph/convo-path";
import { Either, tryCatch, fold } from "fp-ts/lib/Either";
import ConvoSegment from "../models/convo-engine/convo-graph/convo-segment";
import { getNominalValue } from "../util/util-functions";
import log from "../util/logging";
import { identity } from "fp-ts/lib/function";


const stateNavigationStoreFunctionsConstructor: (onInitState: InitialUserState, historyManager: HistoryManager) => StateNavigationStoreFunctions = (initialUserState, historyManager) => {
    const cache: NavigationStoreState = {
        currentConvoSegmentPath: initialUserState.currentConvoSegmentPath
    }
    // Restore history to cache using history manager
    
    return {
        setCurrentConvoSegmentPath: path => cache.currentConvoSegmentPath = path,
        getCurrentConvoSegmentPath: () => cache.currentConvoSegmentPath
    }

}

const stateVariableStoreFunctionsConstructor: (onInitState: InitialUserState, historyManager: HistoryManager) => StateVariableStoreFunctions = (initialUserState, historyManager) => {
    const cache: VariableStoreState = {
        variables: initialUserState.variables
    }
    // Restore history to cache using history manager

    return {
        getStateVariable: key => cache.variables[key],
        setStateVariable: (key, newValue) => {
            cache.variables[key] = newValue
        }
    }
}

const pathWithoutRootId: (rootId: ConvoModuleId, path: ConvoSegmentPath) => ConvoSegmentPath = (rootId, path) => {
    const parentModules = path.parentModules
    if (parentModules && parentModules[0] === rootId) {
        return {
            id: path.id,
            parentModules: parentModules.slice(1)
        }
    } else {
        return path
    }
}

const relativePathToAbsolute: (possiblyRelativePath: ConvoSegmentPath, currentAbsolutePath: ConvoSegmentPath) => ConvoSegmentPath = (possiblyRelativePath, currentAbsolutePath) => {
    if (currentAbsolutePath.parentModules === undefined) {
        throw new Error('Current path can never be relative, parent modules must be defined.')
    }
    if (possiblyRelativePath.parentModules === undefined) {
        return {
            ...possiblyRelativePath,
            parentModules: currentAbsolutePath.parentModules
        }
    } else {
        return possiblyRelativePath
    }
}

const safelyGetConvoSegment: (rootModule: ConvoModule, path: ConvoSegmentPath, currentPath: ConvoSegmentPath) => Either<Error, ConvoSegment> = (rootModule, currentPath, path) => {
    const unsafeRetreive: (path: ConvoSegmentPath) => ConvoSegment = path => {
        const absolutePathExcludingRootId = pathWithoutRootId(
            rootModule.id,
            relativePathToAbsolute(path, currentPath))
        const reducer: (parentModule: ConvoModule, nextChildId: ConvoModuleId) => ConvoModule = (parentModule, nextChildId) => {
            return parentModule.submodules[getNominalValue(nextChildId)]
        }
        const nestedModule = absolutePathExcludingRootId.parentModules!.reduce(reducer, rootModule)
        return nestedModule.convoSegments[path.id]
    }
    
    return tryCatch(() => unsafeRetreive(path),
        e => (e instanceof Error ? new Error(`Module path is invalid: ${path}`) : new Error('Unknown error while retreiving convo segment'))
        )   
}

// Can cause terminal error
const getCurrentConvoSegment: (rootModule: ConvoModule, navigationStoreFunctions: StateNavigationStoreFunctions) => ConvoSegment = (rootModule, navigationStoreFunctions) => {
    const currentPath = navigationStoreFunctions.getCurrentConvoSegmentPath()
    const currentConvoSegmentOrError = safelyGetConvoSegment(rootModule, currentPath, currentPath)
    const errorHandling: (error: Error) => ConvoSegment = error => {
        log.trace(`Unretreivable current convo segment for current convo path: ${JSON.stringify(currentPath)}\nPlease run server with module path tests enabled to help debug this issue.`)
        throw error
    }
    const folding: (resultOrError: Either<Error, ConvoSegment>) => ConvoSegment = fold(errorHandling, identity)
    return folding(currentConvoSegmentOrError)
}

const stateNavigationFunctionsConstructor: (rootModule: ConvoModule, navigationStoreFunctions: StateNavigationStoreFunctions) => StateNavigationFunctions = (rootModule, navigationStoreFunctions) => {
    return {
        safelyGetConvoSegment: path => safelyGetConvoSegment(rootModule, path, navigationStoreFunctions.getCurrentConvoSegmentPath()),
        getCurrentConvoSegment: () => getCurrentConvoSegment(rootModule, navigationStoreFunctions)
    }
}

export const stateManagerConstructor: StateManagerConstructor = {
        getOrInitUserState: (rootModule, onInitState, historyManager) => {
            const stateNavigationStoreFunctions = stateNavigationStoreFunctionsConstructor(onInitState, historyManager)
            const stateVariableStoreFunctions = stateVariableStoreFunctionsConstructor(onInitState, historyManager)
            const stateNavigationFunctions = stateNavigationFunctionsConstructor(rootModule, stateNavigationStoreFunctions)
            return {
                ...stateNavigationStoreFunctions,
                ...stateVariableStoreFunctions,
                ...stateNavigationFunctions
            }
        }
    }