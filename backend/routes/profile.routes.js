const express = require("express");
const router = express.Router();
const { getMyProfile, createOrUpdateProfile,deleteMyProfile } = require("../controllers/profile.controller");
const verifyToken = require("../middleware/auth.middleware");

 

router.get("/me", verifyToken, getMyProfile);
router.delete('/me',verifyToken,deleteMyProfile);
router.post("/", verifyToken, createOrUpdateProfile);

module.exports = router;
