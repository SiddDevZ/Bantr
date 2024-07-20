const express = require("express");
const userModel = require("../models/users");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20120,
    message: "Too many attempts from this IP, please try again after 15 minutes"
});

router.post("/", loginLimiter, async (req, res) => {
    const messageList = req.body.messages;

    try {
        const userIds = [...new Set(messageList.map(message => message.userId))];

        const users = await userModel.find({ _id: { $in: userIds } }, 'username avatar color').exec();

        const userMap = users.reduce((map, user) => {
            map[user._id] = user;
            return map;
        }, {});

        const messagesWithUserDetails = messageList.map(message => {
            const user = userMap[message.userId];
            return {
                userId: message.userId,
                username: user.username,
                avatar: user.avatar,
                color: user.color
            };
        });

        res.status(200).json(messagesWithUserDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
});

module.exports = router;
