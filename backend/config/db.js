const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✅")
    } catch (err) {
        console.log("Failed to Connect ❌", err.message);
    }
   
}

module.exports = connectDB;