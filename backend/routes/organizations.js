const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const organizationController = require('../controllers/organizationController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/organizations
// @desc    Get all organizations
// @access  Public
router.get('/', organizationController.getAllOrganizations);

// @route   GET /api/organizations/:id
// @desc    Get organization by ID
// @access  Public
router.get('/:id', organizationController.getOrganizationById);

// @route   POST /api/organizations
// @desc    Create/Register organization profile
// @access  Private/Organization
router.post('/', [
  protect,
  authorize('organization', 'admin'),
  body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
  body('type').isIn(['ngo', 'charity', 'foundation', 'community', 'religious', 'other']).withMessage('Invalid organization type')
], organizationController.createOrganization);

// @route   PUT /api/organizations/:id
// @desc    Update organization
// @access  Private/Organization
router.put('/:id', protect, authorize('organization', 'admin'), organizationController.updateOrganization);

// @route   PUT /api/organizations/:id/needs
// @desc    Update organization's items needed
// @access  Private/Organization
router.put('/:id/needs', protect, authorize('organization', 'admin'), organizationController.updateItemsNeeded);

// @route   DELETE /api/organizations/:id
// @desc    Delete organization
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), organizationController.deleteOrganization);

module.exports = router;
