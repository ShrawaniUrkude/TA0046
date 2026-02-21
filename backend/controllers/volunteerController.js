const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Get all volunteers
// @route   GET /api/volunteers
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }).select('-password');
    
    res.json({
      success: true,
      count: volunteers.length,
      volunteers
    });
  } catch (error) {
    console.error('GetAllVolunteers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get available tasks for volunteers
// @route   GET /api/volunteers/available-tasks
exports.getAvailableTasks = async (req, res) => {
  try {
    const availableTasks = await Donation.find({ 
      status: 'approved',
      assignedVolunteer: null 
    })
    .populate('donor', 'name email phone address')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: availableTasks.length,
      tasks: availableTasks
    });
  } catch (error) {
    console.error('GetAvailableTasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get volunteer's assigned tasks
// @route   GET /api/volunteers/my-tasks
exports.getMyTasks = async (req, res) => {
  try {
    const myTasks = await Donation.find({ 
      assignedVolunteer: req.user.id 
    })
    .populate('donor', 'name email phone address')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: myTasks.length,
      tasks: myTasks
    });
  } catch (error) {
    console.error('GetMyTasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Accept a donation pickup task
// @route   POST /api/volunteers/accept-task/:donationId
exports.acceptTask = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    if (donation.status !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        message: 'This donation is not available for pickup' 
      });
    }

    if (donation.assignedVolunteer) {
      return res.status(400).json({ 
        success: false, 
        message: 'This task is already assigned to another volunteer' 
      });
    }

    donation.assignedVolunteer = req.user.id;
    donation.status = 'assigned';
    await donation.save();

    res.json({
      success: true,
      message: 'Task accepted successfully',
      donation
    });
  } catch (error) {
    console.error('AcceptTask error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Mark a task as completed
// @route   PUT /api/volunteers/complete-task/:donationId
exports.completeTask = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    if (donation.assignedVolunteer.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to complete this task' 
      });
    }

    donation.status = 'delivered';
    await donation.save();

    res.json({
      success: true,
      message: 'Task marked as completed',
      donation
    });
  } catch (error) {
    console.error('CompleteTask error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
