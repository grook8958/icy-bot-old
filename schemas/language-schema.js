const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('languages', languageSchema);