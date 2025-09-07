const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  specialties: [{
    type: String,
    enum: ['haircut', 'beard', 'mustache', 'shampoo', 'styling', 'coloring', 'perm', 'straightening']
  }],
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  availability: {
    monday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    tuesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    wednesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    thursday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    friday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    saturday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    sunday: {
      isAvailable: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    }
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  portfolio: [{
    image: {
      type: String,
      required: true
    },
    description: String,
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['license', 'certificate', 'id', 'other']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }
}, {
  timestamps: true
});

// Index for better performance
barberSchema.index({ user: 1 });
barberSchema.index({ 'rating.average': -1 });
barberSchema.index({ isActive: 1, isVerified: 1 });

// Virtual for full name
barberSchema.virtual('fullName').get(function() {
  return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
});

// Method to check if barber is available at specific time
barberSchema.methods.isAvailableAt = function(dayOfWeek, time) {
  const day = dayOfWeek.toLowerCase();
  const dayAvailability = this.availability[day];
  
  if (!dayAvailability || !dayAvailability.isAvailable) {
    return false;
  }
  
  const startTime = dayAvailability.startTime;
  const endTime = dayAvailability.endTime;
  
  return time >= startTime && time <= endTime;
};

// Method to update rating
barberSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

module.exports = mongoose.model('Barber', barberSchema);
