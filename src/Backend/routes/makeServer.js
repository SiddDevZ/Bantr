const express = require("express");
const serverModel = require("../models/servers");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const Limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 200,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});


router.post("/", Limiter, async (req, res) => {

    const newServer = new serverModel({
        _id: Math.floor(Math.random() * 10000000000000),
        serverName: `Test Server`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        channels: [
          {
            channelId: Math.floor(Math.random() * 10000000000000),
            channelName: 'General',
            type: 'server'
          },
          {
            channelId: Math.floor(Math.random() * 10000000000000),
            channelName: 'Announcements',
            type: 'server'
          },
          {
            channelId: Math.floor(Math.random() * 10000000000000),
            channelName: 'Public Chat',
            type: 'public'
          }
        ]
      });
    
      try {
        const savedServer = await newServer.save();
        console.log('Random Server Created:', savedServer);
      } catch (err) {
        console.error(err);
      }
});

module.exports = router;