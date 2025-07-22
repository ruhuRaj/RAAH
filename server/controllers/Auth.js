const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Department = require("../models/Department");
const generateToken = require("../utils/generateToken");
const validator = require("validator");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const emailTemplates = require("../utils/emailTemplates");
const otpGenerator = require('otp-generator');

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, contactNumber, address, accountType } = req.body;

  if (!firstName || !lastName || !email || !password || !accountType) {
    res.status(400);
    throw new Error("Please enter all required fields for registration.");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format.");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    accountType,
    active: true,
    additionalDetails: {
      contactNumber,
      address,
    },
  });

  try {
    await mailSender(
      user.email,
      "Welcome to RAAH!",
      emailTemplates.welcomeEmail(user.firstName)
    );
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError.message);
  }

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountType: user.accountType,
    additionalDetails: user.additionalDetails,
    // token: generateToken(user._id, user.accountType),
  });
});


// Register Nodal Officers (must select department)
const registerStaff = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    accountType,
    department, // from frontend
    contactNumber,
    address,
    officerId,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !accountType) {
    res.status(400);
    throw new Error("All required fields must be filled.");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format.");
  }

  if (!["District Magistrate", "Nodal Officers"].includes(accountType)) {
    res.status(400);
    throw new Error("Only DMs and Nodal Officers can be registered using this route.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists.");
  }

  // Validate and fetch department if provided
  let departmentObj = null;
  if (accountType === "Nodal Officers") {
    if (!department) {
      res.status(400);
      throw new Error("Nodal Officers must have a department.");
    }

    departmentObj = await Department.findById(department);
    if (!departmentObj) {
      res.status(400);
      throw new Error("Invalid department ID.");
    }
  }

  // Create the user with department at top-level
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    accountType,
    department: departmentObj ? departmentObj._id : undefined,
    active: true,
    additionalDetails: {
      contactNumber,
      address,
      officerId,
    },
  });

  try {
    await mailSender(
      user.email,
      "Welcome to RAAH!",
      emailTemplates.staffWelcomeEmail(user.firstName, user.accountType, user.email)
    );
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError.message);
  }

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountType: user.accountType,
    department: user.department, // it will now appear here
    additionalDetails: user.additionalDetails,
  });
});





// authenticate a user (login)
const loginUser = asyncHandler(async (req, res) => {
    console.log("Backend loginUser: Received req.body:", req.body); 

    const {email, password, accountType} = req.body; 

    if(!email || !password || !accountType){ 
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Attempt to find the user by email AND accountType
    const user = await User.findOne({email, accountType}).populate("department", "name"); 

    // *** NEW LOGS FOR DEBUGGING LOGIN ***
    if (!user) {
        console.log(`Backend loginUser: User not found for email: ${email} and accountType: ${accountType}`);
        res.status(401);
        throw new Error("Invalid credentials (User not found or incorrect account type)."); // More specific error
    }

    console.log(`Backend loginUser: User found: ${user.email}, Account Type: ${user.accountType}, Active: ${user.active}`);
    
    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    console.log(`Backend loginUser: Password match result for ${user.email}: ${isPasswordMatch}`);

    if(user && isPasswordMatch){
        // Ensure account is active
        if(!user.active){
            console.log(`Backend loginUser: Account for ${user.email} is inactive.`);
            res.status(401); // Changed to 401 for inactive account as well
            throw new Error("Account is inactive. Please contact support.");
        }

        console.log(`Backend loginUser: Login successful for ${user.email}. Generating token.`);
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountType: user.accountType,
            department: user.department,
            additionalDetails: user.additionalDetails, // return populated profile
            token: generateToken(user._id, user.accountType), 
        });
    }
    else{
        // This 'else' block will now primarily catch password mismatch if user is found
        console.log(`Backend loginUser: Password mismatch for ${user.email}.`);
        res.status(401);
        throw new Error("Invalid credentials (Password mismatch)."); // More specific error
    }
});

// password forgot function
// forgotPassword controller

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({ message: "If a user with that email exists, a password reset link has been sent." });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.token = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.YOUR_FRONTEND_URL}/reset-password/${resetToken}`;
  console.log("Reset link being sent:", resetUrl);

  try {
    await mailSender(
      user.email,
      "RAAH Password Reset Request",
      emailTemplates.passwordResetEmail(resetUrl)
    );
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500);
    throw new Error("Error in sending password reset email");
  }
});


// reset password function
const resetPassword = asyncHandler(async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        token: hashedToken,
        resetPasswordExpires: { $gt: Date.now()} 
    });

    const {newPassword, confirmPassword} = req.body;
    if(!newPassword || !confirmPassword){
        res.status(400);
        throw new Error("Please enter both new and confirm password");
    }
    if(newPassword !== confirmPassword){
        res.status(400);
        throw new Error("Passwords donot match");
    }
    if(newPassword.length < 6){
        res.status(400);
        throw new Error("Password must be atleast 6 characters");
    }

    user.password = newPassword; 
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    await user.save(); 

    res.status(200).json({message: 'Password has been reseted successfully'});

});

// get all users (for ADMIN)
const getAllUsers = asyncHandler(async (req, res) => {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1; // Corrected to use 'page' for current page
    const skip = (page - 1) * pageSize;

    let query = {};
    if(req.query.accountType){
        query.accountType = req.query.accountType;
    }
    if(req.query.active){
        query.active = req.query.active === 'true';
    }
    if(req.query.search){
        query.$or = [
            {firstName: {$regex: req.query.search, $options: 'i'}},
            {lastName: {$regex: req.query.search, $options: 'i'}},
            {email: {$regex: req.query.search, $options: 'i'}}
        ];
    }

    const count = await User.countDocuments(query);
    const users = await User.find(query)
        .select('-password -token -resetPasswordExpires') // Exclude sensitive fields
        .populate("department", "name")
        .limit(pageSize)
        .skip(skip)
        .sort({createdAt: -1});

    res.json({
        users,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
});

// update user active status (ADMIN ONLY)
const updateUserStatus = asyncHandler(async (req, res) => {
    const {active} = req.body;

    const user = await User.findById(req.params.id);

    if(!user){
        res.status(400);
        throw new Error("User not found");
    }

    if(user._id.toString() === req.user._id.toString()){
        res.status(400);
        throw new Error("Cannot change status of own account");
    }

    if(typeof active === 'boolean'){
        user.active = active;
        await user.save();
        res.status(200).json({
            _id: user._id,
            email: user.email,
            active: user.active,
            message: `User status set to ${user.active ? 'active' : 'inactive'}`
        });
    }
    else{
        res.status(400);
        throw new Error("Invalid active status provided");
    }
});

// Function to send OTP for email verification
const sendOtp = asyncHandler(async (req, res) => {
    console.log("Backend: sendOtp function called.");
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        res.status(400);
        throw new Error("Please provide a valid email address.");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User with this email already exists. Please login.");
    }

    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    console.log("Backend (Auth.js): Generated OTP:", otp);

    const otpRecord = await OTP.create({ email, otp });
    console.log("Backend (Auth.js): OTP Record created:", otpRecord);

    res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email.",
    });
});

// Function to verify OTP
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error("Please provide email and OTP.");
    }

    const latestOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!latestOtp) {
        res.status(400);
        throw new Error("No OTP found for this email or it has expired.");
    }

    if (latestOtp.otp !== otp) {
        res.status(400);
        throw new Error("Invalid OTP. Please try again.");
    }

    await OTP.deleteMany({ email: email });

    res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
    });
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id; // from protect middleware
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide both old and new password");
  }

  const user = await User.findById(userId).select('+password');
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(oldPassword); // using bcrypt compare
  if (!isMatch) {
    res.status(401);
    throw new Error("Old password is incorrect");
  }

  user.password = newPassword; // this should trigger pre-save hash
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

// Delete user account
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Please provide your password to confirm account deletion");
  }

  const user = await User.findById(userId).select('+password');
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Verify password before deletion
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Incorrect password. Please try again");
  }

  // Check if user has any active grievances (for citizens)
  if (user.accountType === 'Citizen') {
    const Grievance = require('../models/Grievance');
    const activeGrievances = await Grievance.find({
      submittedBy: userId,
      status: { $in: ['Pending', 'In Progress', 'Assigned'] }
    });

    if (activeGrievances.length > 0) {
      res.status(400);
      throw new Error("Cannot delete account with active grievances. Please resolve or withdraw your grievances first.");
    }
  }

  // Check if user has assigned grievances (for nodal officers)
  if (user.accountType === 'Nodal Officers') {
    const Grievance = require('../models/Grievance');
    const assignedGrievances = await Grievance.find({
      assignedTo: userId,
      status: { $in: ['Assigned', 'In Progress'] }
    });

    if (assignedGrievances.length > 0) {
      res.status(400);
      throw new Error("Cannot delete account with assigned grievances. Please reassign or complete your assigned grievances first.");
    }
  }

  // Delete user's profile if exists
  const Profile = require('../models/Profile');
  await Profile.findOneAndDelete({ user: userId });

  // Delete user's OTP records
  const OTP = require('../models/OTP');
  await OTP.deleteMany({ email: user.email });

  // Delete the user
  await User.findByIdAndDelete(userId);

  res.status(200).json({ 
    message: "Account deleted successfully",
    success: true
  });
});

// exports all function
module.exports = {
    registerUser,
    registerStaff,
    loginUser,
    forgotPassword, 
    resetPassword,
    getAllUsers, 
    updateUserStatus, 
    sendOtp,
    verifyOtp,
    changePassword,
    deleteAccount,
};