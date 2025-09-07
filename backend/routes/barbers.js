const express = require('express');
const { body, validationResult } = require('express-validator');
const Barber = require('../models/Barber');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all barbers
// @route   GET /api/barbers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true, isVerified: true };
    
    if (req.query.specialty) {
      filter.specialties = { $in: [req.query.specialty] };
    }

    if (req.query.minRating) {
      filter['rating.average'] = { $gte: parseFloat(req.query.minRating) };
    }

    if (req.query.city) {
      filter['location.city'] = new RegExp(req.query.city, 'i');
    }

    const barbers = await Barber.find(filter)
      .populate('user', 'firstName lastName email phone avatar')
      .populate('services', 'name price duration')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Barber.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        barbers,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get barbers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get barber by ID
// @route   GET /api/barbers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id)
      .populate('user', 'firstName lastName email phone avatar')
      .populate('services', 'name price duration description category')
      .populate({
        path: 'portfolio',
        populate: {
          path: 'service',
          select: 'name'
        }
      });

    if (!barber) {
      return res.status(404).json({
        status: 'error',
        message: 'Barber not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        barber
      }
    });
  } catch (error) {
    console.error('Get barber error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create barber profile
// @route   POST /api/barbers
// @access  Private
router.post('/', protect, authorize('barber'), [
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('specialties').optional().isArray().withMessage('Specialties must be an array'),
  body('experience').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years'),
  body('location.address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('location.city').optional().notEmpty().withMessage('City cannot be empty'),
  body('location.state').optional().notEmpty().withMessage('State cannot be empty'),
  body('location.zipCode').optional().notEmpty().withMessage('Zip code cannot be empty')
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

    // Check if barber profile already exists
    const existingBarber = await Barber.findOne({ user: req.user._id });
    if (existingBarber) {
      return res.status(400).json({
        status: 'error',
        message: 'Barber profile already exists'
      });
    }

    const barberData = {
      user: req.user._id,
      ...req.body
    };

    const barber = await Barber.create(barberData);
    await barber.populate('user', 'firstName lastName email phone avatar');

    res.status(201).json({
      status: 'success',
      message: 'Barber profile created successfully',
      data: {
        barber
      }
    });
  } catch (error) {
    console.error('Create barber error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update barber profile
// @route   PUT /api/barbers/:id
// @access  Private
router.put('/:id', protect, [
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('specialties').optional().isArray().withMessage('Specialties must be an array'),
  body('experience').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years')
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

    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({
        status: 'error',
        message: 'Barber not found'
      });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && barber.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this barber profile'
      });
    }

    const allowedUpdates = ['bio', 'specialties', 'experience', 'availability', 'location'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedBarber = await Barber.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email phone avatar');

    res.json({
      status: 'success',
      message: 'Barber profile updated successfully',
      data: {
        barber: updatedBarber
      }
    });
  } catch (error) {
    console.error('Update barber error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Add portfolio item
// @route   POST /api/barbers/:id/portfolio
// @access  Private
router.post('/:id/portfolio', protect, [
  body('image').notEmpty().withMessage('Image is required'),
  body('description').optional().isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
  body('service').optional().isMongoId().withMessage('Invalid service ID')
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

    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({
        status: 'error',
        message: 'Barber not found'
      });
    }

    // Check ownership
    if (barber.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to add portfolio item for this barber'
      });
    }

    const portfolioItem = {
      image: req.body.image,
      description: req.body.description,
      service: req.body.service
    };

    barber.portfolio.push(portfolioItem);
    await barber.save();

    res.status(201).json({
      status: 'success',
      message: 'Portfolio item added successfully',
      data: {
        portfolio: barber.portfolio
      }
    });
  } catch (error) {
    console.error('Add portfolio item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Remove portfolio item
// @route   DELETE /api/barbers/:id/portfolio/:itemId
// @access  Private
router.delete('/:id/portfolio/:itemId', protect, async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({
        status: 'error',
        message: 'Barber not found'
      });
    }

    // Check ownership
    if (barber.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to remove portfolio item for this barber'
      });
    }

    const portfolioItem = barber.portfolio.id(req.params.itemId);
    if (!portfolioItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Portfolio item not found'
      });
    }

    portfolioItem.remove();
    await barber.save();

    res.json({
      status: 'success',
      message: 'Portfolio item removed successfully',
      data: {
        portfolio: barber.portfolio
      }
    });
  } catch (error) {
    console.error('Remove portfolio item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get barber availability
// @route   GET /api/barbers/:id/availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        status: 'error',
        message: 'Date is required'
      });
    }

    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({
        status: 'error',
        message: 'Barber not found'
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    const dayAvailability = barber.availability[dayOfWeek];
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return res.json({
        status: 'success',
        data: {
          isAvailable: false,
          message: 'Barber is not available on this day'
        }
      });
    }

    // Get existing appointments for this date
    const Appointment = require('../models/Appointment');
    const existingAppointments = await Appointment.find({
      barber: req.params.id,
      date: requestedDate,
      status: { $nin: ['cancelled', 'no_show'] }
    }).select('startTime endTime');

    // Generate available time slots
    const availableSlots = [];
    const startTime = dayAvailability.startTime;
    const endTime = dayAvailability.endTime;
    
    // Convert time to minutes for easier calculation
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const slotDuration = 30; // 30 minutes per slot

    for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
      const slotStart = minutesToTime(minutes);
      const slotEnd = minutesToTime(minutes + slotDuration);
      
      // Check if this slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(appointment => {
        const appStart = timeToMinutes(appointment.startTime);
        const appEnd = timeToMinutes(appointment.endTime);
        return (minutes < appEnd && minutes + slotDuration > appStart);
      });

      if (!hasConflict) {
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd
        });
      }
    }

    res.json({
      status: 'success',
      data: {
        isAvailable: true,
        availableSlots,
        workingHours: {
          start: startTime,
          end: endTime
        }
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Verify barber
// @route   PUT /api/barbers/:id/verify
// @access  Private/Admin
router.put('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({
        status: 'error',
        message: 'Barber not found'
      });
    }

    barber.isVerified = true;
    await barber.save();

    res.json({
      status: 'success',
      message: 'Barber verified successfully'
    });
  } catch (error) {
    console.error('Verify barber error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
