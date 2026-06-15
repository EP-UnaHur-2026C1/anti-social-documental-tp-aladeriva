import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true }
}, { _id: true });

const postSchema = new mongoose.Schema({
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [imageSchema],                 
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);