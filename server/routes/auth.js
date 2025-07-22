const express = require('express');
const router = express.Router();

const {
    registerUser, // Citizen Registration
    loginUser,
    forgotPassword, 
    resetPassword,
    sendOtp,
    verifyOtp,
    changePassword,
    deleteAccount
} = require('../controllers/Auth'); // Only import necessary auth controllers

const { protect } = require('../middleware/auth');

console.log("Backend: Initializing auth routes...");

// Public Authentication Routes
router.post('/register', registerUser); // Citizen Registration (after OTP verification)
console.log("Backend: Registered POST /register route for citizen signup.");

router.post('/login', loginUser);
// console.log("Backend: Registered POST /login route.");

router.post('/forgot-password', forgotPassword); // Corrected typo from forgot-passowrd
// console.log("Backend: Registered POST /forgot-password route.");

router.put('/reset-password/:token', resetPassword);
// console.log("Backend: Registered PUT /reset-password/:token route.");

// OTP Routes (Public)
router.post('/send-otp', sendOtp);
// console.log("Backend: Registered POST /send-otp route.");

router.post('/verify-otp', verifyOtp);
// console.log("Backend: Registered POST /verify-otp route.");

router.put('/change-password', protect, changePassword);

router.delete('/delete-account', protect, deleteAccount);

module.exports = router;