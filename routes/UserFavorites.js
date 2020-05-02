const express = require("express");
const Favorite = require("../models/Favorite");
const router = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

router
.route("/")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, async (req,res) => {
    try {
        //dishes = await Dishes.find({}).populate('comments.author')
        let favorites = await Favorite.findOne({ user: req.user._id }).populate('dishes.dish').populate('user');
        res.status(200).send(favorites);
    } catch (error) {
        res.status(400).send(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req,res) => {
    try {
        if(req.body.length == 0) {
            return res.status(400).send("Data is not valid");
        }
        let favorite = await Favorite.findOne({ user: req.user._id });
        if(!favorite) {
            favorite = new Favorite({
                user: req.user._id,
                dishes: []
            })
        }
        
        req.body.forEach(element => {
            let favoriteDish = favorite.dishes.find( item => item.dish == element._id );
            if(!favoriteDish) {
                favorite.dishes.push({ dish: element._id })
            }
        });
        await favorite.save();
        res.status(200).send(favorite);
    } catch(err) {
        res.status(400).send(err);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        let favorite = await Favorite.findOne({ user: req.user._id });
        favorite.dishes = [];
        await favorite.save();
        res.status(200).send(favorite);
    } catch (err) {
        res.status(400).send(err);
    }
})


router
.route("/:dishId")
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        let favorite = await Favorite.findOne({ user: req.user._id });
        if(!favorite) {
            favorite = new Favorite({
                user: req.user._id,
                dishes: []
            })
        }
        let favoriteDish = favorite.dishes.find( item => item.dish == req.params.dishId );
        if(!favoriteDish) {
            favorite.dishes.push({ dish: req.params.dishId })
        }
        await favorite.save();
        res.status(201).send(favorite);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        let favorite = await Favorite.findOne({ user: req.user._id });
        if(!favorite) {
            return res.status(404).send("No favorites found");
        }
        let favoriteDish = favorite.dishes.find( item => item.dish == req.params.dishId );
        if(favoriteDish) {
            favorite.dishes = favorite.dishes.reduce( (list, item) => {
                if(item.dish != req.params.dishId) {
                    list.push(item);
                }
                return list;
            }, []);
        }
        await favorite.save();
        res.status(200).send(favorite);
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;