const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  customerNotes: {
    type: String,
    maxlength: [500, 'Customer notes cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'SAR', 'AED']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'wallet']
  },
  paymentId: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['customer', 'barber', 'admin', 'system']
  },
  cancelledAt: Date,
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  rescheduledTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true
});

// Index for better performance
appointmentSchema.index({ customer: 1, date: 1 });
appointmentSchema.index({ barber: 1, date: 1 });
appointmentSchema.index({ date: 1, startTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ paymentStatus: 1 });

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted time range
appointmentSchema.virtual('formattedTimeRange').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Virtual for total duration in minutes
appointmentSchema.virtual('duration').get(function() {
  const start = this.startTime.split(':');
  const end = this.endTime.split(':');
  const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
  const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
  return endMinutes - startMinutes;
});

// Method to check if appointment is in the past
appointmentSchema.methods.isPast = function() {
  const now = new Date();
  const appointmentDateTime = new Date(this.date);
  const [hours, minutes] = this.startTime.split(':');
  appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return appointmentDateTime < now;
};

// Method to check if appointment is today
appointmentSchema.methods.isToday = function() {
  const today = new Date();
  const appointmentDate = new Date(this.date);
  return today.toDateString() === appointmentDate.toDateString();
};

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return false;
  }
  
  const now = new Date();
  const appointmentDateTime = new Date(this.date);
  const [hours, minutes] = this.startTime.split(':');
  appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Can cancel up to 2 hours before appointment
  const twoHoursBefore = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000);
  return now < twoHoursBefore;
};

// Method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return false;
  }
  
  const now = new Date();
  const appointmentDateTime = new Date(this.date);
  const [hours, minutes] = this.startTime.split(':');
  appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Can reschedule up to 4 hours before appointment
  const fourHoursBefore = new Date(appointmentDateTime.getTime() - 4 * 60 * 60 * 1000);
  return now < fourHoursBefore;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
