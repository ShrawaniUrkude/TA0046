const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationName: {
    type: String,
    required: [true, 'Please provide organization name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['ngo', 'charity', 'foundation', 'community', 'religious', 'other'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  website: {
    type: String
  },
  logo: {
    type: String
  },
  itemsNeeded: [{
    itemType: String,
    quantity: Number,
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalDonationsReceived: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
