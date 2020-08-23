
type MongoStorageType = 'mongo'

export type MongoStorageAuth = {
    type: MongoStorageType
    username: string 
    password: string
    uri: string
    databaseName: string
}

type NoStorageType = 'no-storage'

type NoStorageAuth = {
    type: NoStorageType
}

export type StorageManagerAuth = MongoStorageAuth | NoStorageAuth
