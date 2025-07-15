const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require("cookie-parser");
const app = express();
 
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
 
app.use("/api/auth", authRoutes); // 👈 mount router on /api/auth

app.get('/',(req,res)=>{
    res.send(`🚀 DevConnector API is running`);
})

module.exports=app;