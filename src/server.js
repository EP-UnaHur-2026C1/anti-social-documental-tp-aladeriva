const app = require('./app');
const connectDB = require('./config/db');
//const { connectRedis } = require('./config/redis');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const tagRoutes = require('./routes/tagRoutes');
const followRoutes = require('./routes/followRoutes');


const PORT = process.env.PORT || 3000;

const startServer = () => {
  connectDB().then(() => {
    // connectRedis();
    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);
    app.use('/tags', tagRoutes);
    app.use('/follows', followRoutes);
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  });
};

module.exports = startServer;