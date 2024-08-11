const express = require("express");
const userModel = require("../models/users");
const serverModel = require("../models/servers");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 120,
    message: "Too many attempts from this IP, please try again after 15 minutes"
});


router.post("/", loginLimiter, async (req, res) => {
    try{
        const user = await userModel.findOne({_id: req.body._id})
        const server = await serverModel.findOne({_id: req.body.serverId})

        if (!user || !server) {
            return res.status(404).json({message: "User or Server not found"})
        }

        await userModel.updateOne(
            { _id: req.body._id },
            { $pull: { joinedServers: req.body.serverId } }
        );

        await serverModel.updateOne(
            { _id: server._id },
            { $pull: { members: req.body._id } }
        );

        return res.status(200).json({ message: "Server ID removed from user's joined servers" });
        
    } catch (err) {
        console.log("Failed to Exit: ", err)
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;