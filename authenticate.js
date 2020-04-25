var passport = require('passport');
var LocalSrategy = require('passport-local').Strategy;
var User = require('./models/User');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalSrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.generateToken = function(user) {
    return jwt.sign(user, config["jwt-secret"], { expiresIn: 3600 });
}
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config["jwt-secret"]
};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest = ExtractJwt.
// opts.secretOrKey = config["jwt-secret"];
exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin) next();
    else {
        let notAdminError = new Error("This action is only applicable by admin.");
        notAdminError.status = 403;
        next(notAdminError);
    }
}
exports.jwtPassport = passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        let user = await User.findOne({ _id: jwt_payload._id });
        if(user) 
            return done(null, user, "Login Verified.");
        done(null, false, "User not Found");
    } catch (error) {
        done(error, null, null);
    }
}))

exports.verifyUser = passport.authenticate('jwt', { session: false })