import { EventRecord } from '../event-record'
import { UserId } from '../state'
import StorageManager from './storage-manager'

interface HistoryManager {
    // TODO: Add support for history...
    // initUserHistory: () => void
    // getUserHistory: () => EventRecord[] | undefined // undefined if user history does not exist
    // updateHistory...
}

export type HistoryManagerConstructor = (
    userId: UserId,
    storageManager: StorageManager
) => HistoryManager

export default HistoryManager
