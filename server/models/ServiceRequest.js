const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled', 'On Hold'],
    default: 'Pending'
  },
  comments: {
    type: String,
    trim: true
  },
  signature: {
    type: String, // Base64 encoded signature image
    default: null
  },
  audioFeedback: {
    type: String, // Path to audio file
    default: null
  },
  videoFeedback: {
    type: String, // Path to video file
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
serviceRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
