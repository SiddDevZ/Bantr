import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema({
    channelId: { type: String, required: true },
    channelName: { type: String, required: true },
    type: { type: String, enum: ['server', 'public'], required: true }
});

const serverSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    owner: { type: String, required: true },
    serverName: { type: String, required: true },
    color: { type: String, required: true },
    channels: { type: [channelSchema], required: true },
    members: { type: [String], default: [], required: true }
});

export const serverModel = mongoose.model("servers", serverSchema);