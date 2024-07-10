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
    const userServers = req.body.userServers;
    try {
        const servers = await serverModel.find({ _id: { $in: userServers } });
        res.status(200).json(servers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching servers", error: err });
    }
});

module.exports = router;