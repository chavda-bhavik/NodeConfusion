const express = require("express");
const authenticate = require('../authenticate');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only Image files are allowed!"))
    }
    cb(null, true);
}
const upload = multer({ storage: storage, fileFilter: imageFileFilter });
router.get("/", (req,res) => {
    res.statusCode = 403;
    res.end("GET Operation is not allowed");
})
router.post("/", authenticate.verifyUser, upload.single("image") , (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})
module.exports = router;