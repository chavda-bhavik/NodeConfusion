const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    }]
}, {
    timestamps: true
})

const Favorite = mongoose.model('Favorite', FavouriteSchema);

module.exports = Favorite