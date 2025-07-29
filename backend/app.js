const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require("cookie-parser");
const profileRoutes = require("./routes/profile.routes");
const app = express();
 
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 

app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes); // 👈 mount router on /api/auth

app.get('/',(req,res)=>{
    res.send(`🚀 DevConnector API is running fine`);
})

module.exports=app;