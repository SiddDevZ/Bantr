const express = require("express");
const userModel = require("../models/users");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const Limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 200,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});


router.post("/", Limiter, async (req, res) => {
    try {
        const user = await userModel.findOne({ token: req.body.token });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err });
    }
});

module.exports = router;