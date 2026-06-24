const { createClient } = require('redis');

let client = null;

const connectRedis = async () => {
  try {
    client = createClient({ url: process.env.REDIS_URL });

    client.on('error', (err) => console.error('❌ Redis error:', err));
    client.on('connect', () => console.log('✅ Redis conectado'));

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ No se pudo conectar a Redis:', error.message);
    return null;
  }
};

const getRedisClient = () => client;

module.exports = { connectRedis, getRedisClient };