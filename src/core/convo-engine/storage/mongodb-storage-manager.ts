import StorageManager, {
    StorageManagerConstructor,
} from '../../models/storage/storage-manager'
import log from '../../util/logging'
import { MongoClient } from 'mongodb'
import { Stores } from '../../models/state/state'
import Event, { EventUpdate, EventType } from '../../models/storage/event'
import EventMongoSchema from '../../models/storage/mongoose-schema/event-schema'
import { IEvent } from '../../models/storage/mongoose-schema/event-schema'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { pipe } from 'fp-ts/lib/pipeable'
import { applyEventsToState } from './event-functions'
import { MongoStorageAuth } from '../../models/storage/auth'

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
    client: MongoClient
) => TE.TaskEither<Error, Event[]> = (userId, client) => {
    log.debug(`Getting all user events for user id ${userId}`)
    return TE.tryCatch(
        R.always(
            new Promise(resolve =>
                client.connect(async (error: Error) => {
                    handleErrorIfNotNull(error)
                    const eventsWithUserId = await EventMongoSchema.find({
                        id: userId,
                    }).then(events => {
                        const result = events.map(safelyParseEvent)
                        log.silly(
                            `For user id ${userId} mapped events to `,
                            result
                        )
                        return result
                    })
                    client.close()
                    resolve(eventsWithUserId)
                })
            )
        ),
        reason => new Error(String(reason))
    )
}

const mongoURI = (mongoAuth: MongoStorageAuth) =>
    `mongodb+srv://${mongoAuth.username}:${mongoAuth.password}@${mongoAuth.uri}/${mongoAuth.databaseName}?retryWrites=true&w=majority`

export const makeMongoDBStorageManager: StorageManagerConstructor<MongoStorageAuth> = mongoAuth => {
    // Establish connection to remote mongodb
    const client = new MongoClient(mongoURI(mongoAuth), {
        useNewUrlParser: true,
    })

    return {
        getUserHistory: userId => {
            // TODO: move commented out code to state manager

            // const applyEventsToInitialState = pipe(
            //     initialState,
            //     R.curry(applyEventsToState)
            // )
            // TE.map(applyEventsToInitialState),
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
                getUserEventHistory(userId, client),
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
