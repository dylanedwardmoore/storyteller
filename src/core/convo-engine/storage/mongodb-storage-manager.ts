import StorageManager, {
    StorageManagerConstructor,
} from '../../models/storage/storage-manager'
import log from '../../util/logging'
import { Stores } from '../../models/state/state'
import Event, { EventUpdate, EventType } from '../../models/storage/event'
import EventMongoSchema from '../../models/storage/mongoose-schema/event-schema'
import { IEvent } from '../../models/storage/mongoose-schema/event-schema'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'ramda'
import { applyEventsToState } from './event-functions'
import { MongoStorageAuth } from '../../models/storage/auth'
import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'

const handleErrorIfNotNull = (error: Error) => {
    if (error) {
        log.fatal(
            'Error connecting to mongodb, check that your credentials in .env are correct.'
        )
        throw error
    }
}

const safelyParseEventUpdate: (
    stringifiedUpdate: string
) => EventUpdate = stringifiedUpdate => {
    // TODO: Add actual safety checks here to validate that this data fits the expected type.
    // This could be particularly important for cases where the schema is updated and old data on the database has not been migrated.
    return JSON.parse(stringifiedUpdate)
}

const safelyParseEventType: (type: string) => EventType = type => {
    // TODO: Add actual safety checks here to validate that this data fits the expected type.
    return type as EventType
}

const safelyParseEvent: (
    mongoEventDocument: IEvent
) => Event = mongoEventDocument => {
    // TODO: Add check that type field cooresponds to correct type for update and undo update fields
    return {
        eventId: mongoEventDocument.eventId,
        userId: mongoEventDocument.userId,
        type: safelyParseEventType(mongoEventDocument.type),
        update: safelyParseEventUpdate(mongoEventDocument.updateFields),
        undoUpdate: safelyParseEventUpdate(mongoEventDocument.undoUpdate),
        timestamp: mongoEventDocument.timestamp,
        reverts: mongoEventDocument.reverts,
    } as Event
}

const getUserEventHistory: (
    userId: string,
    uri: string
) => TE.TaskEither<Error, Event[]> = (userId, uri) => {
    log.debug(`Getting all user events for user id ${userId}`)
    return TE.tryCatch(() => new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useCreateIndex: true,
            })
            const eventsWithUserId = await EventMongoSchema.find(
                { userId }
            ).then(events => {
                log.debug(`found events for user`)
                const result = events.map(safelyParseEvent)
                log.silly(
                    `For user id ${userId} mapped events to `,
                    result
                )
                return result
            })
            resolve(eventsWithUserId)
        } catch (error) {
            reject(error)
        }
    }), (e: any) => typeof e === typeof Error ? e : new Error(e))
}

const mongoURI = (mongoAuth: MongoStorageAuth) =>
    `mongodb+srv://${mongoAuth.username}:${mongoAuth.password}@${mongoAuth.uri}/${mongoAuth.databaseName}?retryWrites=true&w=majority`

export const makeMongoDBStorageManager: StorageManagerConstructor<MongoStorageAuth> = mongoAuth => {
    // Establish connection to remote mongodb
    const uri = mongoURI(mongoAuth)

    return {
        getUserHistory: userId => {
            const errorHandling: (error: Error) => T.Task<Event[]> = (
                error: Error
            ) => {
                log.fatal(
                    `Error fetching data from mongodb for user ${userId}, defaulting to an empty event history. Specific error: `,
                    error
                )
                return T.of([])
            }

            return pipe(
                getUserEventHistory(userId, uri),
                TE.getOrElse(errorHandling)
            )
        },
        addToHistory: event => {
            log.debug(`Saving event to database event: `, event)
            log.debug(`TODO: Add capacity to save events to database`)
            return T.of(undefined)
        },
    }
}
