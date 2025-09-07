const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendAppointmentConfirmation } = require('../utils/sendEmail');

const router = express.Router();

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter based on user role
    let filter = {};
    
    if (req.user.role === 'customer') {
      filter.customer = req.user._id;
    } else if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ user: req.user._id });
      if (barber) {
        filter.barber = barber._id;
      } else {
        return res.status(404).json({
          status: 'error',
          message: 'Barber profile not found'
        });
      }
    }

    // Additional filters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: date, $lt: nextDay };
    }

    if (req.query.dateFrom && req.query.dateTo) {
      filter.date = {
        $gte: new Date(req.query.dateFrom),
        $lte: new Date(req.query.dateTo)
      };
    }

    const appointments = await Appointment.find(filter)
      .populate('customer', 'firstName lastName email phone')
      .populate('barber', 'user')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'firstName lastName phone'
        }
      })
      .populate('service', 'name price duration')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        appointments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('barber', 'user')
      .populate({
        path: 'barber',
        populate: {
          path: 'user',
          select: 'firstName lastName phone'
        }
      })
      .populate('service', 'name price duration description')
      .populate('review', 'rating comment');

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const hasAccess = req.user.role === 'admin' || 
                     appointment.customer._id.toString() === req.user._id.toString() ||
                     (req.user.role === 'barber' && appointment.barber.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this appointment'
      });
    }

    res.json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
router.post('/', protect, authorize('customer'), [
  body('barberId').isMongoId().withMessage('Valid barber ID is required'),
  body('serviceId').isMongoId().withMessage('Valid service ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required'),
  body('customerNotes').optional().isLength({ max: 500 }).withMessage('Customer notes cannot exceed 500 characters')
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

    const { barberId, serviceId, date, startTime, customerNotes } = req.body;

    // Validate barber exists and is active
    const barber = await Barber.findById(barberId).populate('user');
    if (!barber || !barber.isActive || !barber.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Barber not available'
      });
    }

    // Validate service exists and is active
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(400).json({
        status: 'error',
        message: 'Service not available'
      });
    }

    // Check if barber offers this service
    if (!barber.services.includes(serviceId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Barber does not offer this service'
      });
    }

    // Calculate end time
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = startMinutes + service.duration;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    // Check if appointment date is in the future
    const appointmentDate = new Date(date);
    const now = new Date();
    if (appointmentDate < now) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot book appointment in the past'
      });
    }

    // Check barber availability
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    if (!barber.isAvailableAt(dayOfWeek, startTime)) {
      return res.status(400).json({
        status: 'error',
        message: 'Barber is not available at this time'
      });
    }

    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      barber: barberId,
      date: appointmentDate,
      status: { $nin: ['cancelled', 'no_show'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'Time slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      customer: req.user._id,
      barber: barberId,
      service: serviceId,
      date: appointmentDate,
      startTime,
      endTime,
      customerNotes,
      price: service.price,
      currency: service.currency
    });

    // Populate the appointment for response
    await appointment.populate([
      { path: 'customer', select: 'firstName lastName email phone' },
      { path: 'barber', populate: { path: 'user', select: 'firstName lastName phone' } },
      { path: 'service', select: 'name price duration' }
    ]);

    // Send confirmation email
    try {
      await sendAppointmentConfirmation(req.user, appointment);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail appointment creation if email fails
    }

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: {
        appointment
      }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
router.put('/:id', protect, [
  body('status').optional().isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  body('customerNotes').optional().isLength({ max: 500 }).withMessage('Customer notes cannot exceed 500 characters')
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

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const isCustomer = appointment.customer.toString() === req.user._id.toString();
    const isBarber = req.user.role === 'barber';
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isBarber && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this appointment'
      });
    }

    // Determine allowed updates based on role
    const allowedUpdates = [];
    if (isCustomer) {
      allowedUpdates.push('customerNotes');
      if (appointment.canBeCancelled()) {
        allowedUpdates.push('status', 'cancellationReason');
      }
    }
    if (isBarber || isAdmin) {
      allowedUpdates.push('status', 'notes');
    }
    if (isAdmin) {
      allowedUpdates.push('paymentStatus', 'paymentMethod', 'paymentId');
    }

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Handle cancellation
    if (updates.status === 'cancelled') {
      updates.cancelledBy = isCustomer ? 'customer' : (isBarber ? 'barber' : 'admin');
      updates.cancelledAt = new Date();
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'customer', select: 'firstName lastName email phone' },
      { path: 'barber', populate: { path: 'user', select: 'firstName lastName phone' } },
      { path: 'service', select: 'name price duration' }
    ]);

    res.json({
      status: 'success',
      message: 'Appointment updated successfully',
      data: {
        appointment: updatedAppointment
      }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
  body('reason').optional().isLength({ max: 200 }).withMessage('Cancellation reason cannot exceed 200 characters')
], async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const isCustomer = appointment.customer.toString() === req.user._id.toString();
    const isBarber = req.user.role === 'barber';
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isBarber && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this appointment'
      });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment cannot be cancelled at this time'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = req.body.reason;
    appointment.cancelledBy = isCustomer ? 'customer' : (isBarber ? 'barber' : 'admin');
    appointment.cancelledAt = new Date();

    await appointment.save();

    res.json({
      status: 'success',
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
router.put('/:id/reschedule', protect, [
  body('newDate').isISO8601().withMessage('Valid new date is required'),
  body('newStartTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid new start time is required')
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

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check authorization (only customer can reschedule)
    if (appointment.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to reschedule this appointment'
      });
    }

    // Check if appointment can be rescheduled
    if (!appointment.canBeRescheduled()) {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment cannot be rescheduled at this time'
      });
    }

    const { newDate, newStartTime } = req.body;

    // Get service to calculate new end time
    const service = await Service.findById(appointment.service);
    const startMinutes = parseInt(newStartTime.split(':')[0]) * 60 + parseInt(newStartTime.split(':')[1]);
    const endMinutes = startMinutes + service.duration;
    const newEndTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    // Check barber availability
    const barber = await Barber.findById(appointment.barber);
    const appointmentDate = new Date(newDate);
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    if (!barber.isAvailableAt(dayOfWeek, newStartTime)) {
      return res.status(400).json({
        status: 'error',
        message: 'Barber is not available at this time'
      });
    }

    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      barber: appointment.barber,
      date: appointmentDate,
      status: { $nin: ['cancelled', 'no_show'] },
      _id: { $ne: appointment._id },
      $or: [
        {
          startTime: { $lt: newEndTime },
          endTime: { $gt: newStartTime }
        }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'Time slot is already booked'
      });
    }

    // Update appointment
    appointment.date = appointmentDate;
    appointment.startTime = newStartTime;
    appointment.endTime = newEndTime;
    appointment.status = 'pending'; // Reset to pending for confirmation

    await appointment.save();

    res.json({
      status: 'success',
      message: 'Appointment rescheduled successfully'
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;
