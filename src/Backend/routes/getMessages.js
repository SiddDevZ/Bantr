const express = require("express");
const messageModel = require("../models/chats");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2200,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});

router.post("/", loginLimiter, async (req, res) => {
    try {
        const page = req.body.page || 1;
        // const limit = 30;
        // const skip = (page - 1) * limit;
        const channelId = req.body.channelId;

        if (!channelId) {
            return res.status(400).json({ message: "Channel ID is required" });
        }

        const messages = await messageModel.find({ channelId: channelId })
            .sort({ timestamp: 1 })
            // .skip(skip)
            // .limit(limit);

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;