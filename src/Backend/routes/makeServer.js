const express = require("express");
const serverModel = require("../models/servers");
const userModel = require('../models/users')
const rateLimit = require("express-rate-limit");

const router = express.Router();
const Limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 200,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});


router.post("/", Limiter, async (req, res) => {

    const owner = req.body.owner
    const serverId = Math.floor(Math.random() * 10000000000000);

    const newServer = new serverModel({
        _id: serverId,
        serverName: req.body.name,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        owner: owner,
        members: [],
        channels: [
          {
            channelId: Math.floor(Math.random() * 10000000000000),
            channelName: 'Holy shit it worked omfg',
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
        await userModel.findByIdAndUpdate(owner, {
          $addToSet: { joinedServers: serverId }
        });
        res.status(200).json({ serverId: newServer._id })
        // console.log('Server Created: ', savedServer);
      } catch (err) {
        res.status(500).json(err)
        console.error(err);
      }
});

module.exports = router;