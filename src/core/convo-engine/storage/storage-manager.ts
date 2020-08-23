import { StorageManagerAuth } from "../../models/storage/auth"
import StorageManager, { StorageManagerConstructor } from "../../models/storage/storage-manager"
import { makeMongoDBStorageManager } from "./mongodb-storage-manager"
import { makeDummyStorageManager } from "./dummy-storage-manager"


export const makeStorageManager: StorageManagerConstructor<StorageManagerAuth> = auth => {
    switch(auth.type) {
        case 'mongo': 
            return makeMongoDBStorageManager(auth)
        case 'no-storage':
            return makeDummyStorageManager()
    }
}