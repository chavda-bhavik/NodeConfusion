const express = require("express");
const Dishes = require("../models/dishes");
const router = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

router
.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res) => {
    try {
        dishes = await Dishes.find(req.query).populate('comments.author')
        res.status(200).send(dishes);
    } catch (error) {
        res.status(400).send(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        let Dish = new Dishes({
            ...req.body
        });
        await Dish.save();
        res.status(201).send(Dish);   
    } catch (error) {
        res.status(400).send(error);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        let dishes = await Dishes.remove({})
        res.status(200).send(dishes);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.route("/:dishId")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res) => {
    try {
        let Dish = await Dishes.findById(req.params.dishId).populate('comments.author');
        res.status(200).send(Dish);
    } catch (error) {
        res.status(400).send(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req,res) => {
    res.statusCode = 403;
    res.end("Post is not supported with "+req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req,res) => {
    try {
        let Dish = await Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
        res.status(200).send(Dish);
    } catch (error) {
        res.status(400).send(error);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req,res) => {
    try {
        let Dish = await Dishes.findByIdAndRemove(req.params.dishId);
        res.status(200).send(Dish);
    } catch (error) {
        res.status(400).send(error);    
    }
});

router.route("/:dishId/comments")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res) => {
    try {
        let Dish = await Dishes.findById(req.params.dishId).populate('comments.author');
        if(!Dish) {
            return res.status(404).send({ "error": "Dish Not Found" })
        }
        res.status(200).send(Dish.comments);
    } catch (error) {
        res.status(400).send(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req,res) => {
    try {
        let Dish = await Dishes.findById(req.params.dishId);
        if(!Dish) {
            return res.status(404).send({ "error": "Dish Not Found" })
        }
        req.body.author = req.user._id
        Dish.comments.push(req.body);
        await Dish.save();
        await Dish.populate('comments.author');
        res.status(200).send(Dish.comments);
    } catch (error) {
        res.status(400).send(error);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        let Dish = await Dishes.findById(req.params.dishId);
        Dish.comments = [];
        await Dish.save();
        res.status(200).send(Dish);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.route("/:dishId/comments/:commentId")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.put(cors.corsWithOptions, authenticate.verifyUser, async (req,res, next) => {
    try {
        let Dish = await Dishes.findById(req.params.dishId);
        if(!Dish) {
            return res.status(404).send({ "error": "Dish Not Found" })
        }
        let comment = Dish.comments.find( comment => comment._id == req.params.commentId );
        if(comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).send({ "error": "You are not authorised to perform this action"});
        }
        Dish.comments = Dish.comments.map( comment => {
            if(comment._id == req.params.commentId) {
                comment.rating = req.body.rating;
                comment.comment = req.body.comment;
            }
            return comment;
        })
        await Dish.save();
        await Dish.populate('comments.author');
        res.status(200).send(Dish.comments);
    } catch (error) {
        res.status(400).send(error);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req,res) => {
    try {
        let Dish = await Dishes.findById(req.params.dishId);
        if(!Dish) {
            return res.status(404).send({ "error": "Dish Not Found" })
        }
        let comment = Dish.comments.find( comment => comment._id == req.params.commentId );
        if(comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).send({ "error": "You are not authorised to perform this action"});
        }
        Dish.comments = Dish.comments.filter( comment => comment._id != req.params.commentId);
        await Dish.save();
        await Dish.populate('comments.author');
        res.status(200).send(Dish.comments);
    } catch (error) {
        res.status(400).send(error);    
    }
});

module.exports = router;