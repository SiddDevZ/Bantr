const express = require("express");
const messageModel = require("../models/chats");
const rateLimit = require("express-rate-limit");
const moment = require("moment");

const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

router.post("/", loginLimiter, async (req, res, io) => {
  try {
    const now = new Date();
    const newMessage = new messageModel({
      _id: Math.floor(Math.random() * 1000000000000000),
      message: req.body.message,
      username: req.body.userName,
      channelId: req.body.channelId,
      timestamp: now,
      userId: req.body.userId,
    });

    newMessage.save();

    req.app.get('io').to(req.body.channelId).emit('new message');

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
