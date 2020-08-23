import mongoose, { Document } from 'mongoose'

export interface IEvent extends Document {
    eventId: string
    userId: string
    type: string
    updateFields: string
    undoUpdate: string
    timestamp: Date
    reverts: string | undefined
}

const Schema = mongoose.Schema
export const EventSchema = new Schema({
    type: {
        eventId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        updateFields: {
            type: String,
            required: true,
        },
        undoUpdate: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        reverts: {
            type: String,
            default: undefined,
            required: false,
        },
    },
})

const EventMongoModel = mongoose.model<IEvent>('event', EventSchema)

export default EventMongoModel
