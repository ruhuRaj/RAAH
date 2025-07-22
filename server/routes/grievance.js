const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  addGrievanceComment,
  assignGrievance,
  getDashboardStats,
  getUnassignedGrievances,
  getAssignedGrievances,
} = require('../controllers/grievance');

const { protect, authorizeAccountType } = require('../middleware/auth');
const upload = require('../middleware/multerConfig');

// @route   POST /api/grievances
// @desc    Create new grievance (Citizen only)
// @access  Private
router.post(
  '/',
  protect,
  authorizeAccountType("Citizen"),
  upload.array('attachments', 5),
  createGrievance
);

// SPECIAL GET ROUTES FIRST
// @route   GET /api/grievances/stats/dashboard
// @desc    Get grievance statistics for dashboard
// @access  Private
router.get('/stats/dashboard', protect, getDashboardStats);

// @route   GET /api/grievances/unassigned
// @desc    Get unassigned grievances (DM only)
// @access  Private (DM only)
router.get('/unassigned', protect, authorizeAccountType('District Magistrate'), getUnassignedGrievances);

// @route   GET /api/grievances/assigned
// @desc    Get assigned grievances (Nodal Officers only)
// @access  Private (Nodal Officers only)
router.get('/assigned', protect, authorizeAccountType('Nodal Officers'), getAssignedGrievances);

// @route   GET /api/grievances/test
// @desc    Test route to verify the router is working
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Grievance router is working!' });
});

// GENERIC GET ROUTES
// @route   GET /api/grievances
// @desc    Get all grievances (Public or protected as needed)
// @access  Public
router.get('/', getGrievances);

// @route   GET /api/grievances/:id
// @desc    Get grievance by ID
// @access  Public (with logic in controller to restrict Citizen access)
router.get('/:id', getGrievanceById);

// @route   PUT /api/grievances/:id
// @desc    Update grievance (status, assignment, feedback)
// @access  Private (DM, Officers)
router.put('/:id', protect, updateGrievance);

// @route   DELETE /api/grievances/:id
// @desc    Delete grievance (DM only)
// @access  Private (DM only)
router.delete('/:id', protect, authorizeAccountType('District Magistrate'), deleteGrievance);

// @route   POST /api/grievances/:id/comments
// @desc    Add comment to grievance
// @access  Private (user or officers)
router.post('/:id/comments', protect, addGrievanceComment);

router.put(
  '/:id/assign',
  protect,
  authorizeAccountType('District Magistrate'),
  assignGrievance
);

module.exports = router;
