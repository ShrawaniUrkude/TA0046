const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    required: [true, 'Please specify the item type'],
    enum: ['clothes', 'food', 'books', 'toys', 'electronics', 'furniture', 'medical', 'other']
  },
  itemName: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    min: 1
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    default: 'good'
  },
  images: [{
    type: String
  }],
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  preferredPickupTime: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'assigned', 'picked-up', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedOrganization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
donationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
