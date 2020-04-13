const express = require("express");
const router = express.Router();

router.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
router.get("", (req,res,next) => {
    res.end('Will send all the promotions to you!');
})
router.post("", (req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
router.put("", (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
router.delete("", (req, res, next) => {
    res.end('Deleting all promotions');
})

router.get("/:promotionId", (req,res) => {
    res.end('Will send promotione of id '+req.params.promotionId);
})
router.post('/:promotionId', (req,res) => {
    res.statusCode = 403;
    res.end("Post is not supported with "+req.params.promotionId);
})
router.put('/:promotionId', (req,res) => {
    res.end('promotion Updated with Id '+req.params.promotionId);
})
router.delete('/:promotionId', (req,res) => {
    res.end('Deleted promotion with Id '+req.params.promotionId);
});

module.exports = router;