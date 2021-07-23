const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('prefix-schemas', prefixSchema);