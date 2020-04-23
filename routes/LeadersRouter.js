const express = require("express");
const LeaderShip = require("../models/Leader");
const router = express.Router();
const authenticate = require('../authenticate')

// router.all(async (req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
router.get("", async (req,res) => {
    try {
        let leaders = await LeaderShip.find({});
        res.status(200).send(leaders);
    } catch (error) {
        res.status(400).send(error);
    }
})
router.post("", authenticate.verifyUser, async (req, res) => {
    try {
        let Leader = new LeaderShip({
            ...req.body
        })
        await Leader.save();
        res.status(201).send(Leader);
    } catch (eror) {
        res.status(400).send(error);
    }
})
// router.put("", async (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /promotions');
// })
// router.delete("", async (req, res, next) => {
//     res.end('Deleting all promotions');
// })

router.get("/:leaderId", async (req,res) => {
    try {
        let Leader = await LeaderShip.findById(req.params.leaderId);
        if(!Leader) {
            return res.status(404).send({ error: "Leader not found!"});
        }
        res.status(200).send(Leader);
    } catch (error) {
        res.status(400).send(error);
    }
})
// router.post('/:promotionId', async (req,res) => {
//     res.statusCode = 403;
//     res.end("Post is not supported with "+req.params.promotionId);
// })
router.put('/:leaderId', authenticate.verifyUser, async (req,res) => {
    try {
        let Leader = await LeaderShip.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true });
        if(!Leader) {
            return res.status(404).send({ error: "Leader not found!"});
        }
        res.status(200).send(Leader);
    } catch (error) {
        res.status(400).send(error);
    }
})
router.delete('/:leaderId', authenticate.verifyUser, async (req,res) => {
    try {
        let Leader = await LeaderShip.findByIdAndRemove(req.params.leaderId);
        if(!Leader) {
            return res.status(404).send({ error: "Leader not found!"});
        }
        res.status(200).send(Leader);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;