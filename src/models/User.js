const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

module.exports = mongoose.model('User', userSchema);