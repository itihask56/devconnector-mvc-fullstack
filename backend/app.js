const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send(`🚀 DevConnector API is running`);
})

module.exports=app;