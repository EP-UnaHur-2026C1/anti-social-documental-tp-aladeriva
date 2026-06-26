const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower_nickname: {
    type: String,
    ref: 'User',
    required: true
  },
  followed_nickname: {
    type: String,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

followSchema.index(
  { follower_nickname: 1, followed_nickname: 1 },
  { unique: true }
);

module.exports = mongoose.model('Follow', followSchema);