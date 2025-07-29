const jwt = require("jsonwebtoken");
const {redisClient } = require("../config/redis");

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];
      // console.log(req.cookies.token)

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(token);
    // console.log(isBlacklisted);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    // console.log(error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};



module.exports = verifyToken;
