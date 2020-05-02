var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require("express-session");
var fileStore = require("session-file-store")(session);
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var leaderRouter = require('./routes/LeadersRouter');
var dishRouter = require('./routes/DishRouter');
var promotionRouter = require('./routes/PromotionRouter');
var UploadRouter = require('./routes/UploadRouter');
const passport = require('passport');
var UserFavoriteRouter = require('./routes/UserFavorites');
// const Dishes = require('../node-mongoose/models/dishes');
const url = config.mongoUrl;

try {
  mongoose.connect(url, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
} catch(error) {
  console.log(error);
}


var app = express();
app.all('*', (req,res,next) => {
  if(req.secure) {
    return next();
  } else {
    res.redirect(307, "https://" + req.hostname + ':' + app.get('secPort') + req.url);
  }
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(cookieParser('signed-key'));
// app.use(session({
//   name: 'session-id',
//   secret: 'signed-key',
//   saveUninitialized: false,
//   resave: false,
//   store: new fileStore()
// }));

app.use(passport.initialize());
// app.use(passport.session());

const passportAuth = (req, res, next) => {
  if(!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 401;
    next(err);
  } else {
    next();
  }
}
const sessionAuth = (req,res,next) => {
  if(!req.session.user) {
    let err = new Error("You are not authenticated");
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status = 401;
    next(err);
    return;
  } else {
    if(req.session.user === 'authenticated') {
      next();
    } else {
      let err = new Error("You are not authenticated");
      res.status = 403;
      next(err);
    }
  }
}
const cookieAuth = (req, res, next) => {
  console.log(req.signedCookies);
  if(!req.signedCookies.user) {
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
  
    if( username === 'admin' && password === 'password' ) {
      res.cookie("user", 'admin', { signed: true })
      next(); // authorized
    } else {
      let err = new Error("You are not authenticated");
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status = 401;
      next(err);
    }
  } else {
    if(req.signedCookies.user === 'admin') {
      next();
    } else {
      let err = new Error("You are not authenticated");
      res.setHeader('WWW-Authenticate', 'Basic');
      res.status = 401;
      next(err);
    }
  }
}
const basicAuth = (req,res,next) => {
  console.log(req.headers)
  var authHeader = req.headers.authorization;
  
  if(!authHeader) {
    let err = new Error("You are not authenticated");
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status = 401;
    next(err);
    return;
    //return res.setHeader('WWW-Authenticate', 'Basic').status(401).send({ error: "You are not authenticated!"})
  }
  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var username = auth[0];
  var password = auth[1];

  if( username === 'admin' && password === 'password' ) {
    next(); // authorized
  } else {
    let err = new Error("You are not authenticated");
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status = 401;
    next(err);
  }
}
app.use('/', indexRouter);
app.use('/users', usersRouter); 

// app.use(passportAuth);
app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', UploadRouter);
app.use('/favorites', UserFavoriteRouter);

// catch 404 and forward to error handler 
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status = err.status || 500;
  res.render('error');
});

module.exports = app;
