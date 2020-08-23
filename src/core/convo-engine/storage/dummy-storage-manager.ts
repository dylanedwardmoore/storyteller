import StorageManager from '../../models/storage/storage-manager'
import * as T from 'fp-ts/lib/Task'

// Used as a placeholder for cases when no auth is provided for real storage
export const makeDummyStorageManager: () => StorageManager = () => ({
    getUserHistory: userId => T.of([]),
    addToHistory: (userId, event) => T.of(undefined),
})
