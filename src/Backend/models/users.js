import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, required: true },
    avatar: { type: String, required: false },
    color: { type: String, required: true },
    joinedServers: { type: [String], default: [], required: true }
});

export const userModel = mongoose.model("users", userSchema);