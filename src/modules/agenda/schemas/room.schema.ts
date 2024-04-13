import * as mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true
    },
    customerId: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: true,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });