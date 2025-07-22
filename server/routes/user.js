const express = require('express');
const router = express.Router();
const {
    // Import only user management related controllers
    registerStaff, // For DM to register staff
    // getProfile,    // Get current user's profile
    // updateProfile, // Update current user's profile
    getAllUsers,   // Get all users (for admin/nodal)
    updateUserStatus, // Update user status (for admin)

} = require('../controllers/Auth'); // Ensure these are correctly imported from Auth.js

const {protect, authorizeAccountType} = require('../middleware/auth');

// console.log("Backend: Initializing user routes...");

// Public Routes (No public routes remain here for general users,
// as citizen registration is now in auth.js)

// Private Routes for authenticated users
// router.get('/profile', protect, getProfile);
// console.log("Backend: Registered GET /profile route.");

// router.put('/profile', protect, updateProfile); // user can update their own basic details
// console.log("Backend: Registered POST /profile route.");

// Private Routes for District Magistrate (Admin)
router.post('/register-staff', protect, authorizeAccountType('District Magistrate'), registerStaff); // DMs can register staff
// console.log("Backend: Registered POST /register-staff route.");

router.get('/', protect, authorizeAccountType('District Magistrate', 'Nodal Officers'), getAllUsers); // DMs/Nodal can view all users, filtered by query
// console.log("Backend: Registered GET / route (get all users).");

router.put('/:id/status', protect, authorizeAccountType('District Magistrate', 'Nodal Officers'), updateUserStatus); // DM can activate/deactivate users
// console.log("Backend: Registered PUT /:id/status route.");

module.exports = router;
