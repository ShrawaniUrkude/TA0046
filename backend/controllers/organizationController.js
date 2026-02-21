const Organization = require('../models/Organization');
const { validationResult } = require('express-validator');

// @desc    Get all organizations
// @route   GET /api/organizations
exports.getAllOrganizations = async (req, res) => {
  try {
    const { type, verified, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (verified !== undefined) query.isVerified = verified === 'true';

    const organizations = await Organization.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Organization.countDocuments(query);

    res.json({
      success: true,
      count: organizations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      organizations
    });
  } catch (error) {
    console.error('GetAllOrganizations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get organization by ID
// @route   GET /api/organizations/:id
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!organization) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organization not found' 
      });
    }

    res.json({
      success: true,
      organization
    });
  } catch (error) {
    console.error('GetOrganizationById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create organization profile
// @route   POST /api/organizations
exports.createOrganization = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Check if organization profile already exists for this user
    const existingOrg = await Organization.findOne({ user: req.user.id });
    if (existingOrg) {
      return res.status(400).json({ 
        success: false, 
        message: 'Organization profile already exists' 
      });
    }

    const {
      organizationName,
      type,
      description,
      registrationNumber,
      address,
      contactPerson,
      website
    } = req.body;

    const organization = await Organization.create({
      user: req.user.id,
      organizationName,
      type,
      description,
      registrationNumber,
      address,
      contactPerson,
      website
    });

    res.status(201).json({
      success: true,
      organization
    });
  } catch (error) {
    console.error('CreateOrganization error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
exports.updateOrganization = async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organization not found' 
      });
    }

    // Check ownership
    if (organization.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this organization' 
      });
    }

    organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      organization
    });
  } catch (error) {
    console.error('UpdateOrganization error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update organization's items needed
// @route   PUT /api/organizations/:id/needs
exports.updateItemsNeeded = async (req, res) => {
  try {
    const { itemsNeeded } = req.body;

    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { itemsNeeded },
      { new: true, runValidators: true }
    );

    if (!organization) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organization not found' 
      });
    }

    res.json({
      success: true,
      organization
    });
  } catch (error) {
    console.error('UpdateItemsNeeded error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organization not found' 
      });
    }

    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    console.error('DeleteOrganization error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
