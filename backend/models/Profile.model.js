const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 🔁 Refers to the User collection
    required: true,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  skills: {
    type: [String], // Array of strings
    required: true,
  },
  website: {
    type: String,
  },
  github: {
    type: String,
  },
  location: {
    type: String,
  },
  social: {
    linkedin: { type: String },
    twitter: { type: String },
    portfolio: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Profile", profileSchema); //error can be occured from this line of code
