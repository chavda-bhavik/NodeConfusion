const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;

const PromotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    label: {
        type: String,
        required: true,
    },
    price: {
        type: currency,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    featured: {
        type: Boolean,
        required: false,
        default: false
    }
})

const Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion