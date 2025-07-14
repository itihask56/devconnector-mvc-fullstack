const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { client: redisClient } = require('../config/redis');
const validateUserData = require('../utils/validate')

exports.registerUser = async (req, res) => {
  // Logic here...

  try {
   
    //validate user details
    const validation = validateUserData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    //destructer req.body

     const {name,email,password}=req.body;

    //check wheather user exist or not
    const isUserExist = await User.findOne({email});
    if(isUserExist){
       return res.status(400).json({message:"User already exist"});
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    //create user

    const user = await User.create({name,email,password:hashedPassword});

    //create token
    const token = jwt.sign({id:user._id,email:user.email,isAdmin:user.isAdmin},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    return res.status(201).json({ message: "User Registered Successfully", token });
    
  } catch (error) {
    console.log("Error occured:" + error.message);
    return res.status(500).json({ message: "Something went wrong on the server." });
    
  }
};

exports.loginUser = async (req, res) => {
  // Logic here...
};

exports.logoutUser = async (req, res) => {
  // Add token to Redis blacklist
};


