const Profile = require("../models/Profile.model");

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    // console.log("User ID from token:", req.user.id); 
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "email"]);
    console.log("Profile found:", profile);
    
    if (!profile) {
      return res.status(404).json({ message: "No profile found for this user" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      bio,
      skills,
      website,
      github,
      location,
      linkedin,
      twitter,
      portfolio,
    } = req.body;

    // 📦 Build profile object
    const profileFields = {
      user: req.user.id,
      bio,
      website,
      github,
      location,
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim())
        : [],
      social: {
        linkedin,
        twitter,
        portfolio,
      },
    };

    // console.log("User ID from token:", req.user._id);

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    return res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating/updating profile:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.deleteMyProfile=async(req,res)=>{

  try {
    const userId = req.user.id;
    const deleteProfile = await Profile.findOneAndDelete({ user: userId });
    if(!deleteProfile){
      console.log("No profile found for this user")
      return res.status(404).json({ message: "No profile found for this user" });
    }

    console.log("Profile deleted successfuly")
    return res.status(200).json({ message: "Profile deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting profile:", error.message);
    return res.status(500).json({ message: "Server error while deleting profile" ,error:error.message});
  }

}
