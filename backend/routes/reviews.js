const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isPublic: true, isVerified: true };
    
    if (req.query.barberId) {
      filter.barber = req.query.barberId;
    }

    if (req.query.serviceId) {
      filter.service = req.query.serviceId;
    }

    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }

    if (req.query.minRating) {
      filter.rating = { $gte: parseInt(req.query.minRating) };
    }

    // Build sort
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'rating') {
      sort = { rating: -1, createdAt: -1 };
    } else if (req.query.sortBy === 'helpful') {
      sort = { 'helpful.count': -1, createdAt: -1 };
    }

    const reviews = await Review.find(filter)
      .populate('customer', 'firstName lastName avatar')
      .populate('barber', 'user')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('service', 'name')
      .populate('appointment', 'date startTime')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        reviews,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('customer', 'firstName lastName avatar')
      .populate('barber', 'user')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('service', 'name')
      .populate('appointment', 'date startTime')
      .populate('response.respondedBy', 'firstName lastName');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, authorize('customer'), [
  body('appointmentId').isMongoId().withMessage('Valid appointment ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { appointmentId, rating, comment, images } = req.body;

    // Check if appointment exists and belongs to user
    const appointment = await Appointment.findById(appointmentId)
      .populate('barber')
      .populate('service');

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    if (appointment.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to review this appointment'
      });
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only review completed appointments'
      });
    }

    // Check if review already exists for this appointment
    const existingReview = await Review.findOne({ appointment: appointmentId });
    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'Review already exists for this appointment'
      });
    }

    // Create review
    const review = await Review.create({
      customer: req.user._id,
      barber: appointment.barber._id,
      service: appointment.service._id,
      appointment: appointmentId,
      rating,
      comment,
      images: images || []
    });

    // Update appointment with review reference
    appointment.review = review._id;
    await appointment.save();

    // Update barber rating
    await appointment.barber.updateRating(rating);

    // Update service rating
    await appointment.service.updateRating(rating);

    // Populate the review for response
    await review.populate([
      { path: 'customer', select: 'firstName lastName avatar' },
      { path: 'barber', populate: { path: 'user', select: 'firstName lastName' } },
      { path: 'service', select: 'name' },
      { path: 'appointment', select: 'date startTime' }
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Review created successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check authorization
    if (review.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this review'
      });
    }

    const allowedUpdates = ['rating', 'comment', 'images'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'customer', select: 'firstName lastName avatar' },
      { path: 'barber', populate: { path: 'user', select: 'firstName lastName' } },
      { path: 'service', select: 'name' },
      { path: 'appointment', select: 'date startTime' }
    ]);

    res.json({
      status: 'success',
      message: 'Review updated successfully',
      data: {
        review: updatedReview
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check authorization
    const isOwner = review.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.markHelpful(req.user._id);

    res.json({
      status: 'success',
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Unmark review as helpful
// @route   DELETE /api/reviews/:id/helpful
// @access  Private
router.delete('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.unmarkHelpful(req.user._id);

    res.json({
      status: 'success',
      message: 'Review unmarked as helpful'
    });
  } catch (error) {
    console.error('Unmark helpful error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Respond to review
// @route   POST /api/reviews/:id/response
// @access  Private
router.post('/:id/response', protect, [
  body('text').isLength({ min: 1, max: 500 }).withMessage('Response must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id).populate('barber');
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user is the barber or admin
    const isBarber = review.barber.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBarber && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to respond to this review'
      });
    }

    // Check if response already exists
    if (review.response.text) {
      return res.status(400).json({
        status: 'error',
        message: 'Response already exists for this review'
      });
    }

    review.response = {
      text: req.body.text,
      respondedBy: req.user._id,
      respondedAt: new Date()
    };

    await review.save();

    res.json({
      status: 'success',
      message: 'Response added successfully'
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
router.post('/:id/report', protect, [
  body('reason').isIn(['inappropriate', 'spam', 'fake', 'offensive', 'other']).withMessage('Invalid report reason')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.reportReview(req.user._id, req.body.reason);

    res.json({
      status: 'success',
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get barber reviews
// @route   GET /api/reviews/barber/:barberId
// @access  Public
router.get('/barber/:barberId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { 
      barber: req.params.barberId, 
      isPublic: true, 
      isVerified: true 
    };

    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }

    const reviews = await Review.find(filter)
      .populate('customer', 'firstName lastName avatar')
      .populate('service', 'name')
      .populate('appointment', 'date startTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(filter);

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { barber: review.barber, isPublic: true, isVerified: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        reviews,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        },
        ratingStats: ratingStats[0] || { averageRating: 0, totalReviews: 0 }
      }
    });
  } catch (error) {
    console.error('Get barber reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
