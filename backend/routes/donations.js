const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const donationController = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/donations
// @desc    Get all donations
// @access  Private
router.get('/', protect, donationController.getAllDonations);

// @route   GET /api/donations/my-donations
// @desc    Get logged in user's donations
// @access  Private
router.get('/my-donations', protect, donationController.getMyDonations);

// @route   GET /api/donations/:id
// @desc    Get donation by ID
// @access  Private
router.get('/:id', protect, donationController.getDonationById);

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private/Donor
router.post('/', [
  protect,
  authorize('donor', 'admin'),
  upload.array('images', 5),
  body('itemType').notEmpty().withMessage('Item type is required'),
  body('itemName').trim().notEmpty().withMessage('Item name is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], donationController.createDonation);

// @route   PUT /api/donations/:id
// @desc    Update donation
// @access  Private
router.put('/:id', protect, donationController.updateDonation);

// @route   PUT /api/donations/:id/status
// @desc    Update donation status
// @access  Private
router.put('/:id/status', protect, donationController.updateDonationStatus);

// @route   DELETE /api/donations/:id
// @desc    Delete donation
// @access  Private
router.delete('/:id', protect, donationController.deleteDonation);

module.exports = router;
