const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    uploadProfileImage,
} = require('../controllers/profile');
const {protect, authorizeAccountType} = require('../middleware/auth');
const upload = require('../middleware/multerConfig');

// Get user profile (any authorized user can get their own or others they are allowed to see)
router.get('/:userId', protect, getProfile);

// update user profile details
router.put('/:userId', protect, updateProfile); // user can update their own and DM/NODAL can update staff

// upload profile image (requires multer for file handling)
router.post('/:userId/upload-image', protect, upload.single("file"), uploadProfileImage);

module.exports = router;