const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.minPrice) {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    }

    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }

    if (req.query.isPopular) {
      filter.isPopular = req.query.isPopular === 'true';
    }

    // Build sort
    let sort = {};
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { averageRating: -1 };
          break;
        case 'popular':
          sort = { isPopular: -1, averageRating: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { isPopular: -1, averageRating: -1 };
    }

    const services = await Service.find(filter)
      .populate('barbers', 'user')
      .populate({
        path: 'barbers',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        services,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('barbers', 'user rating')
      .populate({
        path: 'barbers',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar'
        }
      });

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Service name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('category').isIn(['haircut', 'beard', 'mustache', 'shampoo', 'styling', 'coloring', 'perm', 'straightening', 'other']).withMessage('Invalid category'),
  body('duration').isInt({ min: 15, max: 300 }).withMessage('Duration must be between 15 and 300 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'SAR', 'AED']).withMessage('Invalid currency')
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

    const service = await Service.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Service created successfully',
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Service name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('category').optional().isIn(['haircut', 'beard', 'mustache', 'shampoo', 'styling', 'coloring', 'perm', 'straightening', 'other']).withMessage('Invalid category'),
  body('duration').optional().isInt({ min: 15, max: 300 }).withMessage('Duration must be between 15 and 300 minutes'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'SAR', 'AED']).withMessage('Invalid currency')
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

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    const allowedUpdates = ['name', 'description', 'category', 'duration', 'price', 'currency', 'image', 'isActive', 'isPopular', 'requirements', 'tags'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Service updated successfully',
      data: {
        service: updatedService
      }
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    
    res.json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const services = await Service.find({ 
      isActive: true, 
      isPopular: true 
    })
    .populate('barbers', 'user rating')
    .populate({
      path: 'barbers',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    })
    .sort({ averageRating: -1, reviewCount: -1 })
    .limit(limit);

    res.json({
      status: 'success',
      data: {
        services
      }
    });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Add barber to service
// @route   POST /api/services/:id/barbers
// @access  Private/Admin
router.post('/:id/barbers', protect, authorize('admin'), [
  body('barberId').isMongoId().withMessage('Valid barber ID is required')
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

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    const { barberId } = req.body;

    // Check if barber exists
    const Barber = require('../models/Barber');
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({
        status: 'error',
        message: 'Barber not found'
      });
    }

    // Add barber to service if not already added
    if (!service.barbers.includes(barberId)) {
      service.barbers.push(barberId);
      await service.save();
    }

    // Add service to barber if not already added
    if (!barber.services.includes(req.params.id)) {
      barber.services.push(req.params.id);
      await barber.save();
    }

    res.json({
      status: 'success',
      message: 'Barber added to service successfully'
    });
  } catch (error) {
    console.error('Add barber to service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Remove barber from service
// @route   DELETE /api/services/:id/barbers/:barberId
// @access  Private/Admin
router.delete('/:id/barbers/:barberId', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    const barberIndex = service.barbers.indexOf(req.params.barberId);
    if (barberIndex > -1) {
      service.barbers.splice(barberIndex, 1);
      await service.save();
    }

    // Remove service from barber
    const Barber = require('../models/Barber');
    const barber = await Barber.findById(req.params.barberId);
    if (barber) {
      const serviceIndex = barber.services.indexOf(req.params.id);
      if (serviceIndex > -1) {
        barber.services.splice(serviceIndex, 1);
        await barber.save();
      }
    }

    res.json({
      status: 'success',
      message: 'Barber removed from service successfully'
    });
  } catch (error) {
    console.error('Remove barber from service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
