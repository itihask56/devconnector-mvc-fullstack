const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");

router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, this is your dashboard` });
});

module.exports = router;
