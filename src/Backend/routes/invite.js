const express = require("express");
const userModel = require("../models/users");
const serverModel = require("../models/servers");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const Limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 200,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});


router.post("/", Limiter, async (req, res) => {
    const token = req.body.token;
    const serverId = req.body.serverId;
    
    try {
        const server = await serverModel.findOne({ _id: serverId });
        
        if (server) {

            const user = await userModel.findOne({ token: token });
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!user.joinedServers.includes(serverId)) {

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { joinedServers: serverId }
                });

                await serverModel.findByIdAndUpdate(serverId, {
                    $addToSet: { members: user._id }
                });

                res.status(200).json({ message: "Joined server successfully", server });
            } else {
                res.status(200).json({ message: "User already in server", server });
            }
        } else {
            res.status(404).json({ message: "Server not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching Server", error: err });
    }
});

module.exports = router;