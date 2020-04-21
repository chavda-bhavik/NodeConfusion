var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var leaderRouter = require('./routes/LeadersRouter');
var dishRouter = require('./routes/DishRouter');
var promotionRouter = require('./routes/PromotionRouter');

// const Dishes = require('../node-mongoose/models/dishes');
const url = 'mongodb://localhost:27017/conFusion';

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('signed-key'));

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

app.use(cookieAuth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

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
