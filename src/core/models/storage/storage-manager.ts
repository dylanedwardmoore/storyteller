import Event from './event'
import { UserId, GeneralizedState, Stores } from '../state/state'
import { Task } from 'fp-ts/lib/Task'
import { StorageManagerAuth } from './auth'

interface StorageManager {
    getUserHistory: (userId: UserId) => Task<Event[]>
    addToHistory: (userId: UserId, event: Event) => Task<void>
}

export type StorageManagerConstructor<T extends StorageManagerAuth> = (
    auth: T
) => StorageManager

export default StorageManager
