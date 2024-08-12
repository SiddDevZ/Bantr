import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    message: { type: String, required: true },
    username: { type: String, required: true },
    channelId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    userId: { type: String, required: true }
});

export const messageModel = mongoose.model("chats", chatSchema);