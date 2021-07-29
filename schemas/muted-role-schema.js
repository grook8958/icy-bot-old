const mongoose = require('mongoose');

const mutedRoleSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('muted-role', mutedRoleSchema);