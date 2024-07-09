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

    try {
        //const { channelName, channelType } = req.body;
        const serverId = req.body.serverId
        const channelName = req.body.newChannelName
        const channelType = req.body.channelType

        if (!serverId || !channelName || !channelType) {
            console.log(serverId, channelName, channelType)
            return res.status(400).json({ message: "Missing required fields" });
        }

        const server = await serverModel.findById(serverId);

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const newChannel = {
            channelId: Math.floor(Math.random() * 10000000000000),
            channelName: channelName,
            type: channelType
        };

        server.channels.push(newChannel);

        await server.save();

        res.status(201).json("Channel created successfully");

    } catch (error) {
        console.error("Error creating channel: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

module.exports = router;