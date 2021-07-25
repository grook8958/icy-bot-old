const mongoose = require('mongoose');

const warningsSchema = new mongoose.Schema({
  _id: {
    type: String, //UserId
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  warnings: {
    type: [Object],
    required: true
  }
});

module.exports = mongoose.model('warnings', warningsSchema);