const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true }
}, { _id: true });

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const postSchema = new mongoose.Schema({
  description: { type: String, required: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  images: [imageSchema],

  comments: [commentSchema],

  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]

}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);