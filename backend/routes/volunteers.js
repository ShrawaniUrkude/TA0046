const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/volunteers
// @desc    Get all volunteers
// @access  Private/Admin/Organization
router.get('/', protect, authorize('admin', 'organization'), volunteerController.getAllVolunteers);

// @route   GET /api/volunteers/available-tasks
// @desc    Get available tasks for volunteers
// @access  Private/Volunteer
router.get('/available-tasks', protect, authorize('volunteer'), volunteerController.getAvailableTasks);

// @route   GET /api/volunteers/my-tasks
// @desc    Get volunteer's assigned tasks
// @access  Private/Volunteer
router.get('/my-tasks', protect, authorize('volunteer'), volunteerController.getMyTasks);

// @route   POST /api/volunteers/accept-task/:donationId
// @desc    Accept a donation pickup task
// @access  Private/Volunteer
router.post('/accept-task/:donationId', protect, authorize('volunteer'), volunteerController.acceptTask);

// @route   PUT /api/volunteers/complete-task/:donationId
// @desc    Mark a task as completed
// @access  Private/Volunteer
router.put('/complete-task/:donationId', protect, authorize('volunteer'), volunteerController.completeTask);

module.exports = router;
