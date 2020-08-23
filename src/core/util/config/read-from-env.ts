import * as dotenv from 'dotenv'
import { ChatClientAuth } from "../../models/chat-client/auth"
import { StorageManagerAuth } from "../../models/storage/auth"
import * as R from 'ramda'

type Auth = {
    clientAuth: ChatClientAuth
    storageAuth: StorageManagerAuth
}

// Throws an error if expected key is not found
const getValueFromEnvFile: (key: string) => string = key => {
    const valueFromEnvFile = process.env[key]
    if (valueFromEnvFile === undefined) {
        const missingKeyErrorMessage =
            `.env file is either not set up or does not contain ${key} field.
            \nPlease update .env file and restart server.`
        throw new Error(missingKeyErrorMessage)
    } else {
        return valueFromEnvFile
    } 
}

const typeKeys = {
    storage: `STORAGE_TYPE`,
    client: `CLIENT_TYPE`
}

// e.g. where `CLIENT_TYPE=telegram` must be specified in .env 
const clientRequiredKeysByType = {
    telegram: {
        apiKey: 'API_KEY'
    }
}

const storageRequiredKeysByType = {
    no: [], // For `STORAGE_TYPE=no`, which specifies dummy storage should be used
    mongo: {
        username: 'MONGODB_USERNAME',
        password: 'MONGODB_PASSWORD',
        uri: 'MONGODB_URI',
        databaseName: 'MONGODB_DATABASE_NAME'
    }
}

const expectedClientTypeValues = {
    telegram: 'telegram'
}

// Throws error on unexpected type or missing fields
const readClientAuthFromEnvFile: (type: string) => ChatClientAuth = type => {
    switch(type) {
        case expectedClientTypeValues.telegram:
            return { 
                type: 'telegram',
                apiKey: getValueFromEnvFile(clientRequiredKeysByType.telegram.apiKey)
            }
        default:
            const allClientTypes = R.values(expectedClientTypeValues).join(', ')
            const unrecognizedTypeValueMessage = `The value associated to ${typeKeys.client} in the .env file did 
                not match any of the expected options ${allClientTypes}`
            throw new Error(unrecognizedTypeValueMessage)
    }
}

const expectedStorageTypeValues = {
    dummy: 'no',
    mongo: 'mongo'
}

// Throws error on unexpected type or missing fields
const readStorageAuthFromEnvFile: (type: string) => StorageManagerAuth = type => {
    switch(type) {
        case expectedStorageTypeValues.dummy:
            return {
                type: 'no-storage'
            }
        case expectedStorageTypeValues.mongo:
            return {
                type: 'mongo',
                username: getValueFromEnvFile(storageRequiredKeysByType.mongo.username),
                password: getValueFromEnvFile(storageRequiredKeysByType.mongo.password),
                uri: getValueFromEnvFile(storageRequiredKeysByType.mongo.uri),
                databaseName: getValueFromEnvFile(storageRequiredKeysByType.mongo.databaseName)
            }
        default:
            const allStorageTypes = R.values(expectedStorageTypeValues).join(', ')
            const unrecognizedTypeValueMessage = `The value associated to ${typeKeys.storage} in the .env file did 
                not match any of the expected options ${allStorageTypes}`
            throw new Error(unrecognizedTypeValueMessage)
    }
}

// Throws an error if storage and client auth type and auth values are not specified
export const readAuthFromEnvFile: () => Auth = () => {
    dotenv.config()
    process.env
    
    const clientType = getValueFromEnvFile(typeKeys.client)
    const storageType = getValueFromEnvFile(typeKeys.storage)
    
    return {
        storageAuth: readStorageAuthFromEnvFile(storageType),
        clientAuth: readClientAuthFromEnvFile(clientType)
    }
}
