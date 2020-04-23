var express = require('express');
const User = require('./../models/User');
var router = express.Router();
var passport = require("passport");
var authenticate = require('./../authenticate')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/signup', async (req,res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
      return
    }
    passport.authenticate('local')(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Signed up sucessfully' })
    })
  })
})

router.post('/login', passport.authenticate('local'), (req,res) => {
  var token = authenticate.generateToken({_id: req.user._id })
  res.statusCode = 200;
  //res.cookie('authToken', 'bearer '+token);
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token, status: 'Login Successful!' })
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