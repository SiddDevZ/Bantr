const express = require('express');
const router = express.Router();
const userModel = require('../models/users');

router.post('/', async (req, res) => {
    try {
        const memberIds = req.body.currentMembers;
        const members = await userModel.find(
            { _id: { $in: memberIds } },
            '_id username avatar color' // Select only these fields
        );
        // console.log(members)
        // console.log(memberIds)
        res.status(200).json(members);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
