const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { redisClient } = require('../config/redis');
const validateUserData = require('../utils/validate')
 

exports.registerUser = async (req, res) => {
  
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
    const token = jwt.sign({_id:user._id,email:user.email,isAdmin:user.isAdmin},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    // res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
     res.cookie("token", token, {
     httpOnly: true,
     secure: false,         // 🔥 keep false in local (set true in production/HTTPS)
     sameSite: "lax",       // or "strict" if frontend served from same domain
      });

    console.log("User registered successfully")
    return res.status(200).json({ message: "User Registered Successfully", token });
    
  } catch (error) {
    console.log("Error occured:" + error.message);
    return res.status(500).json({ message: "Something went wrong on the server." });
    
  }
};

exports.loginUser = async (req, res) => {
  // Logic here...
  try {
    const {email,password}=req.body;

    //check wheather user exist
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"User is not registered"});

    }

    //compare the password
   const isPasswordCorrect= await bcrypt.compare(password,user.password);
   if(!isPasswordCorrect){
    return res.status(400).json({message:"Invalid Credentials"})
   }

   //create token
    const token = jwt.sign({_id:user._id,email:user.email,isAdmin:user.isAdmin},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

   res.cookie("token", token, {
  httpOnly: true,
  secure: false,         // 🔥 keep false in local (set true in production/HTTPS)
  sameSite: "lax",       // or "strict" if frontend served from same domain
});


    console.log("User loggedin successfully")
    return res.status(200).json({ message: "Logged in successfully", token });

    

  } catch (error) {
    console.log("Erorr in logging "+error.message);
    return res.status(500).json({message:"Error in logging"})
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(400).json({ message: "No token provided" });

    await redisClient.set(token, "blacklisted", { EX: 60 * 60 }); // ⏳ 1 hour

    res.clearCookie("token");

    console.log("User loggedout successfully");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout:", error.message);
    return res.status(500).json({ message: "Logout failed" });
  }
};




