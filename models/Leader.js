const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
    },
    designation: {
        type: String,
        required: true,
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    featured: {
        type: Boolean,
        default: false,
    }
})

const Leader = mongoose.model('Leader', LeaderSchema);

module.exports = Leader