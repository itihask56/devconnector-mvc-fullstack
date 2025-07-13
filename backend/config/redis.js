const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-11363.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 11363,
  },
});

redisClient.on("error", (err) => console.log("❌ Redis Client Error:", err));

// Wrapping inside an async init function
async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");

    // // Sample usage
    // await redisClient.set("foo", "bar");
    // const result = await redisClient.get("foo");
    // console.log("Value from Redis:", result); // bar
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
}

module.exports = { redisClient, connectRedis };

// // backend/config/redis.js
// const redis = require('redis');

// const client = redis.createClient({
// username: "default",
//   password: process.env.REDIS_PASS,
//   socket: {
//     host: "redis-11363.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
//     port: 11363,
//   },
 
// });

// client.on('error', (err) => console.error('❌ Redis error:', err));
// client.on('connect', () => console.log('✅ Redis connected'));

// const connectRedis = async () => {
//   try {
//     await client.connect();
//   } catch (err) {
//     console.error('❌ Redis connection failed:', err.message);
//   }
// };

// module.exports = { connectRedis, client };
