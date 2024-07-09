const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    message: { type: String, required: true },
    channelId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    userId: { type: String, required: true }
});

const chatModel = mongoose.model("chats", chatSchema);
module.exports = chatModel;