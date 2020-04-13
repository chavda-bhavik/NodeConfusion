const express = require("express");
const router = express.Router();

router.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
router.get("", (req,res,next) => {
    res.end('Will send all the dishes to you!');
})
router.post("", (req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
router.put("", (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
router.delete("", (req, res, next) => {
    res.end('Deleting all dishes');
})

router.get("/:dishId", (req,res) => {
    res.end('Will send dishe of id '+req.params.dishId);
})
router.post('/:dishId', (req,res) => {
    res.statusCode = 403;
    res.end("Post is not supported with "+req.params.dishId);
})
router.put('/:dishId', (req,res) => {
    res.end('Dish Updated with Id '+req.params.dishId);
})
router.delete('/:dishId', (req,res) => {
    res.end('Deleted dish with Id '+req.params.dishId);
});

module.exports = router;