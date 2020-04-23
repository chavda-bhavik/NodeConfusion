const express = require("express");
const router = express.Router();
const Promotion = require('./../models/Promotion');
const authenticate = require('../authenticate');

// router.all(async (req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
router.get("", async (req,res) => {
    try {
        let promotions = await Promotion.find({});
        res.status(200).send(promotions);
    } catch (error) {
        res.status(400).send(error);
    }
})
router.post("", authenticate.verifyUser, async (req, res) => {
    try {
        let promo = new Promotion({
            ...req.body
        });
        await promo.save();
        res.status(200).send(promo);
    } catch (error) {
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

router.get("/:promotionId", async (req,res) => {
    try {
        let promo = await Promotion.findById(req.params.promotionId);
        if(!promo) {
            return res.status(404).send({ error: "Promotion Not Found!"})
        }
        res.status(200).send(promo);
    } catch (error) {
        res.status(400).send(error);
    }
})
// router.post('/:promotionId', async (req,res) => {
//     res.statusCode = 403;
//     res.end("Post is not supported with "+req.params.promotionId);
// })
router.put('/:promotionId', authenticate.verifyUser, async (req,res) => {
    try {
        let promo = await Promotion.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        });
        if(!promo) {
            return res.status(404).send({ error: "Promotion Not Found!"})
        }
        res.status(200).send(promo);
    } catch (error) {
        res.status(400).send(error);
    }
})
router.delete('/:promotionId', authenticate.verifyUser, async (req,res) => {
    try {
        let promo = await Promotion.findByIdAndRemove(req.params.promotionId);
        if(!promo) {
            return res.status(404).send({ error: "Promotion Not Found!"})
        }
        res.status(200).send(promo);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;