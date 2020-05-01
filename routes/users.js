var express = require('express');
const User = require('./../models/User');
var router = express.Router();
var passport = require("passport");
var authenticate = require('./../authenticate')

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
  try {
    let users = await User.find();
    users = users.map( user => ({ firstname: user.firstname, lastname: user.lastname, admin: user.admin, username: user.username }));
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/signup', async (req,res) => {
  try {
    let user = await User.register(new User({ username: req.body.username }), req.body.password);

    if(req.body.firstname) user.firstname = req.body.firstname;
    if(req.body.lastname) user.lastname = req.body.lastname;
    await user.save();
    
    passport.authenticate('local')(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Signed up sucessfully' })
    })
  }
  catch(err) {
    if(err) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
      return
    }
  }
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

router.get('/facebook/token', passport.authenticate('facebook-token'), (req,res) => {
  if(req.user) {
    var token = authenticate.generateToken({_id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token, status: 'Login Successful!' })
  }
})

module.exports = router;