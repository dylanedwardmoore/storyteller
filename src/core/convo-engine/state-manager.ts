import {
    StateManagerConstructor,
    StateNavigationFunctions,
    StateNavigationStoreFunctions,
    StateVariableStoreFunctions,
} from '../models/state/managers/state-manager'
import ConvoModule, {
    ConvoModuleId,
} from '../models/convo-engine/convo-graph/convo-module'
import StorageManager from '../models/storage/storage-manager'
import {
    NavigationStoreState,
    Stores,
    VariableStoreState,
} from '../models/state/state'
import {
    ConvoSegmentPath,
    AbsoluteConvoSegmentPath,
} from '../models/convo-engine/convo-graph/convo-path'
import { Either, tryCatch, fold } from 'fp-ts/lib/Either'
import ConvoSegment from '../models/convo-engine/convo-graph/convo-segment'
import { getNominalValue } from '../util/util-functions'
import log from '../util/logging'
import { identity, pipe } from 'fp-ts/lib/function'
import { applyEventsToState } from './storage/event-functions'
import * as R from 'ramda'
import * as T from 'fp-ts/lib/Task'
import Event from '../models/storage/event'

const stateNavigationStoreFunctionsConstructor: (
    onInitState: Stores
) => StateNavigationStoreFunctions = initialUserState => {
    const cache: NavigationStoreState = {
        currentConvoSegmentPath: initialUserState.currentConvoSegmentPath,
    }
    // Restore history to cache using history manager

    return {
        setCurrentConvoSegmentPath: path => {
            const absolutePath = relativePathToAbsolute(
                path,
                cache.currentConvoSegmentPath
            )
            log.silly(`update current path to `, absolutePath)
            cache.currentConvoSegmentPath = absolutePath
        },
        getCurrentConvoSegmentPath: () => {
            log.silly(
                `getting current convo path, which is `,
                cache.currentConvoSegmentPath
            )
            return cache.currentConvoSegmentPath
        },
    }
}

const retrieveStoredState: (
    userId: string,
    storageManager: StorageManager,
    initialUserState: Stores
) => Promise<Stores> = async (userId, storageManager, initialUserState) => {
    const applyEvents: (e: Event[]) => Stores = R.curry(applyEventsToState)(
        initialUserState
    )
    return await pipe(
        userId,
        storageManager.getUserHistory,
        T.map(applyEvents)
    )()
}

const stateVariableStoreFunctionsConstructor: (
    onInitState: Stores
) => StateVariableStoreFunctions = initialUserState => {
    initialUserState.variables.userId
    const cache: VariableStoreState = {
        variables: initialUserState.variables,
    }
    // Restore history to cache using history manager

    return {
        getState: () => cache.variables,
        updateState: updates => {
            const { userId, ...previousState } = cache.variables

            // userId can never be updated by convo logic.
            // Note that it is also not advisable to modify lastUserMessage from convo logic,
            // even though that field is not as strongly protected.

            cache.variables = {
                ...previousState,
                ...updates,
                userId,
            }
        },
    }
}

const pathWithoutRootId: (
    rootId: ConvoModuleId,
    path: ConvoSegmentPath
) => ConvoSegmentPath = (rootId, path) => {
    const parentModules = path.parentModules
    if (parentModules && parentModules[0] === rootId) {
        return {
            id: path.id,
            parentModules: parentModules.slice(1),
        }
    } else {
        return path
    }
}

const relativePathToAbsolute: (
    possiblyRelativePath: ConvoSegmentPath,
    currentAbsolutePath: AbsoluteConvoSegmentPath
) => AbsoluteConvoSegmentPath = (possiblyRelativePath, currentAbsolutePath) => {
    if (currentAbsolutePath.parentModules === undefined) {
        throw new Error(
            'Current path can never be relative, parent modules must be defined.'
        )
    }
    const parentModules = possiblyRelativePath.parentModules
    if (parentModules === undefined) {
        return {
            ...possiblyRelativePath,
            parentModules: currentAbsolutePath.parentModules,
        }
    } else {
        return {
            ...possiblyRelativePath,
            parentModules,
        }
    }
}

export const safelyGetConvoSegment: (
    rootModule: ConvoModule,
    path: ConvoSegmentPath,
    currentPath: AbsoluteConvoSegmentPath
) => Either<Error, ConvoSegment> = (rootModule, path, currentPath) => {
    const unsafeRetreive: (path: ConvoSegmentPath) => ConvoSegment = path => {
        const absolutePathExcludingRootId = pathWithoutRootId(
            rootModule.id,
            relativePathToAbsolute(path, currentPath)
        )
        const reducer: (
            parentModule: ConvoModule,
            nextChildId: ConvoModuleId
        ) => ConvoModule = (parentModule, nextChildId) => {
            return parentModule.submodules[getNominalValue(nextChildId)]
        }
        const nestedModule = absolutePathExcludingRootId.parentModules!.reduce(
            reducer,
            rootModule
        )
        const resultOrUndefined = nestedModule.convoSegments[path.id]
        if (resultOrUndefined === undefined) {
            throw new Error(`No convo segment with the specified id is defined`)
        } else {
            return resultOrUndefined
        }
    }

    return tryCatch(
        () => unsafeRetreive(path),
        e =>
            e instanceof Error
                ? new Error(`Module path is invalid: ${path}`)
                : new Error('Unknown error while retreiving convo segment')
    )
}

// Throws error if convo segment not found.
const getCurrentConvoSegment: (
    rootModule: ConvoModule,
    navigationStoreFunctions: StateNavigationStoreFunctions
) => ConvoSegment = (rootModule, navigationStoreFunctions) => {
    const currentPath = navigationStoreFunctions.getCurrentConvoSegmentPath()
    const currentConvoSegmentOrError = safelyGetConvoSegment(
        rootModule,
        currentPath,
        currentPath
    )
    const errorHandling: (error: Error) => ConvoSegment = error => {
        log.trace(
            `Unretreivable current convo segment for current convo path: `,
            currentPath,
            `Please run server with module path tests enabled to help debug this issue.`
        )
        throw error
    }
    const folding: (
        resultOrError: Either<Error, ConvoSegment>
    ) => ConvoSegment = fold(errorHandling, identity)
    return folding(currentConvoSegmentOrError)
}

const stateNavigationFunctionsConstructor: (
    rootModule: ConvoModule,
    navigationStoreFunctions: StateNavigationStoreFunctions
) => StateNavigationFunctions = (rootModule, navigationStoreFunctions) => {
    return {
        safelyGetConvoSegment: path =>
            safelyGetConvoSegment(
                rootModule,
                path,
                navigationStoreFunctions.getCurrentConvoSegmentPath()
            ),
        getCurrentConvoSegment: () =>
            getCurrentConvoSegment(rootModule, navigationStoreFunctions),
        getAbsolutePath: path =>
            relativePathToAbsolute(
                path,
                navigationStoreFunctions.getCurrentConvoSegmentPath()
            ),
    }
}

export const stateManagerConstructor: StateManagerConstructor = {
    getOrInitStateManager: async (rootModule, onInitState, storageManager) => {
        const userId = onInitState.variables.userId
        const cacheFromStorage = await retrieveStoredState(
            userId,
            storageManager,
            onInitState
        )

        const stateNavigationStoreFunctions = stateNavigationStoreFunctionsConstructor(
            cacheFromStorage
        )
        const stateVariableStoreFunctions = stateVariableStoreFunctionsConstructor(
            cacheFromStorage
        )
        const stateNavigationFunctions = stateNavigationFunctionsConstructor(
            rootModule,
            stateNavigationStoreFunctions
        )

        return {
            ...stateNavigationStoreFunctions,
            ...stateVariableStoreFunctions,
            ...stateNavigationFunctions,
        }
    },
}
