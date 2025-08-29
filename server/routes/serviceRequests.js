const express = require('express');
const ServiceRequest = require('../models/ServiceRequest');
const { authenticate } = require('./../middleware/auth');

const router = express.Router();

// Create a new service request
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      serviceName,
      customerName,
      phone,
      email,
      companyName,
      scheduledDateTime,
      assignedTo,
      status
    } = req.body;

    const serviceRequest = new ServiceRequest({
      serviceName,
      customerName,
      phone,
      email,
      companyName,
      scheduledDateTime,
      assignedTo,
      status,
      createdBy: req.user.id
    });

    await serviceRequest.save();
    res.status(201).json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service request', error });
  }
});

// Fetch all service requests
router.get('/', authenticate, async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({})
      .populate('createdBy', 'name'); // Populate createdBy field with user name
    res.status(200).json(serviceRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service requests', error });
  }
});

// Update a service request
router.put('/:id', authenticate, async (req, res) => {
  const { comments, status, signature, audioFeedback, videoFeedback } = req.body;

  try {
    // First find the service request to check ownership
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // Check if the authenticated user is the creator of the service request
    if (serviceRequest.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only update service requests you created.' });
    }

    // Proceed with the update
    const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        comments,
        status,
        signature,
        audioFeedback,
        videoFeedback,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.status(200).json(updatedServiceRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service request', error });
  }
});

module.exports = router;
