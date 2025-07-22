const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Department = require('../models/Department');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

// Get user profile by user ID
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId)
    .populate("department", "name")
    .exec();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Authorization: Allow own profile or DM/Nodal
  const isSelf = req.user._id.toString() === user._id.toString();
  const isDMorNodal = ["District Magistrate", "Nodal Officers"].includes(req.user.accountType);

  if (!isSelf && !isDMorNodal) {
    res.status(403);
    throw new Error("Not authorized to view this profile");
  }

  res.status(200).json(user);
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const {
    firstName,
    lastName,
    contactNumber,
    address,
    gender,
    dateOfBirth,
    officerId,
    department,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;

  // Embedded additionalDetails update
  user.additionalDetails = {
    ...user.additionalDetails,
    contactNumber: contactNumber || user.additionalDetails?.contactNumber,
    address: address || user.additionalDetails?.address,
    gender: gender || user.additionalDetails?.gender,
    dateOfBirth: dateOfBirth || user.additionalDetails?.dateOfBirth,
    officerId: officerId || user.additionalDetails?.officerId,
  };

  // Top-level department update (for nodal officers)
  if (department) {
    const deptExists = await Department.findById(department);
    if (!deptExists) {
      res.status(400);
      throw new Error("Invalid department ID");
    }
    user.department = department;
  }

  await user.save();

  const updatedUser = await User.findById(userId)
    .populate("department", "name");

  res.status(200).json({ updatedUser });
});

// Upload profile image
const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!req.file) throw new Error("No image file provided");

  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    folder: "RAAH_profiles",
    resource_type: "image",
    public_id: `profile_${userId}`,
    overwrite: true,
  });

  user.image = uploadResult.secure_url;
  await user.save();
  fs.unlinkSync(req.file.path);

  res.status(200).json({
    message: "Image uploaded",
    imageUrl: uploadResult.secure_url,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
};
