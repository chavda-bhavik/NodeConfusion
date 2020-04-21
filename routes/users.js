var express = require('express');
const User = require('./../models/User');
const { route } = require('.');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/signup', async (req,res) => {
  try {
    let user = await User.findOne({ username: req.body.username })
    if(user) {
      res.status = 403;
      res.send({ error: "User already exists with username" });
      return;
    }
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
})

router.post('/login', async (req,res) => {
  try {
    if(!req.session.user) {
      var authHeader = req.headers.authorization;
    
      if(!authHeader) {
        let err = new Error("You are not authenticated");
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status = 401;
        next(err);
        return;
        //return res.setHeader('WWW-Authenticate', 'Basic').status(401).send({ error: "You are not authenticated!"})
      }
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];
    
      let user = await User.findOne({ username: username })
      if(!user) {
        res.status = 400;
        res.send({ error: "User Not Found"})
        return;
      }
      if(user.password !== password) {
        res.status = 400;
        res.send({ error: "Password is not currect"});
        return;
      }
      req.session.user = "authenticated";
      res.statusCode = 200;
      res.send("Login Successful");
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

router.get('/logout', (req,res) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    res.send(err);
  }
})

module.exports = router;