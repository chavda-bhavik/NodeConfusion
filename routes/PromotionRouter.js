const express = require("express");
const router = express.Router();
const Promotion = require('./../models/Promotion');
const authenticate = require('../authenticate');
const cors = require("./cors");

// router.all(async (req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })

router.route("/")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res) => {
    try {
        let promotions = await Promotion.find(req.query);
        res.status(200).send(promotions);
    } catch (error) {
        res.status(400).send(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
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

router.route("/:promotionId")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res) => {
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
.post(cors.corsWithOptions, async (req,res) => {
    res.statusCode = 403;
    res.end("Post is not supported with "+req.params.promotionId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req,res) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req,res) => {
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