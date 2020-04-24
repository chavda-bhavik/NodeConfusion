const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({ 
    firstname: {
        type: String,
        default: "",
    },
    lastname: {
        type: String,
        default: ""
    },
    admin: {
        type: Boolean,
        default: false
    }
})

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;