require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const {connectRedis,redisClient}=require('./config/redis');

const PORT = process.env.PORT || 8000;

const startServer=async()=>{
    await connectDB();
    await connectRedis();

    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    })
}

startServer();




