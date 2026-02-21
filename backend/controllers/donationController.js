const Donation = require('../models/Donation');
const { validationResult } = require('express-validator');

// @desc    Get all donations
// @route   GET /api/donations
exports.getAllDonations = async (req, res) => {
  try {
    const { status, itemType, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (itemType) query.itemType = itemType;

    const donations = await Donation.find(query)
      .populate('donor', 'name email')
      .populate('assignedVolunteer', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Donation.countDocuments(query);

    res.json({
      success: true,
      count: donations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      donations
    });
  } catch (error) {
    console.error('GetAllDonations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get logged in user's donations
// @route   GET /api/donations/my-donations
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('assignedVolunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    console.error('GetMyDonations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone')
      .populate('assignedVolunteer', 'name email phone');

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    res.json({
      success: true,
      donation
    });
  } catch (error) {
    console.error('GetDonationById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a new donation
// @route   POST /api/donations
exports.createDonation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      itemType,
      itemName,
      description,
      quantity,
      condition,
      pickupAddress,
      preferredPickupTime,
      notes
    } = req.body;

    // Handle uploaded images
    const images = req.files ? req.files.map(file => file.path) : [];

    const donation = await Donation.create({
      donor: req.user.id,
      itemType,
      itemName,
      description,
      quantity,
      condition,
      images,
      pickupAddress,
      preferredPickupTime,
      notes
    });

    res.status(201).json({
      success: true,
      donation
    });
  } catch (error) {
    console.error('CreateDonation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
exports.updateDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this donation' 
      });
    }

    donation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      donation
    });
  } catch (error) {
    console.error('UpdateDonation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id/status
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    res.json({
      success: true,
      donation
    });
  } catch (error) {
    console.error('UpdateDonationStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this donation' 
      });
    }

    await donation.deleteOne();

    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('DeleteDonation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
