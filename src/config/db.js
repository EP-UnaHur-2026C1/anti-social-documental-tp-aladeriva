const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(MONGODB_URI);

    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
};

module.exports = connectDB;