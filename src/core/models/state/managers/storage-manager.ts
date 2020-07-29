import { EventRecord } from '../event-record'
import { UserId } from '../state'

interface StorageManager {
    readAllDataEntries: (userId: UserId) => string[]
    appendDataEntry: (userId: UserId, dataEntry: string) => void
    deleteAllDataEntries: (userId: UserId) => void
}

export default StorageManager
