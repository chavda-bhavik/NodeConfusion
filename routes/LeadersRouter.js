const express = require("express");
const router = express.Router();

router.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
router.get("", (req,res,next) => {
    res.end('Will send all the leaders to you!');
})
router.post("", (req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
router.put("", (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
router.delete("", (req, res, next) => {
    res.end('Deleting all leaders');
})

router.get("/:leaderId", (req,res) => {
    res.end('Will send leader of id '+req.params.leaderId);
})
router.post('/:leaderId', (req,res) => {
    res.statusCode = 403;
    res.end("Post is not supported with "+req.params.leaderId);
})
router.put('/:leaderId', (req,res) => {
    res.end('leader Updated with Id '+req.params.leaderId);
})
router.delete('/:leaderId', (req,res) => {
    res.end('Deleted leader with Id '+req.params.leaderId);
});

module.exports = router;