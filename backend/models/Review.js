const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    type: String // URLs to uploaded images
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  response: {
    text: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other']
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better performance
reviewSchema.index({ barber: 1, createdAt: -1 });
reviewSchema.index({ service: 1, rating: -1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ appointment: 1 }, { unique: true });
reviewSchema.index({ isPublic: 1, isVerified: 1 });

// Virtual for formatted rating
reviewSchema.virtual('formattedRating').get(function() {
  return `${this.rating}/5`;
});

// Virtual for time since review
reviewSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
});

// Method to mark review as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to unmark review as helpful
reviewSchema.methods.unmarkHelpful = function(userId) {
  const userIndex = this.helpful.users.indexOf(userId);
  if (userIndex > -1) {
    this.helpful.users.splice(userIndex, 1);
    this.helpful.count -= 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to report review
reviewSchema.methods.reportReview = function(userId, reason) {
  if (!this.reportedBy.some(report => report.user.toString() === userId.toString())) {
    this.reportedBy.push({
      user: userId,
      reason: reason,
      reportedAt: new Date()
    });
    
    if (this.reportedBy.length >= 3) {
      this.isReported = true;
    }
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get average rating for a barber
reviewSchema.statics.getAverageRating = function(barberId) {
  return this.aggregate([
    { $match: { barber: barberId, isPublic: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get average rating for a service
reviewSchema.statics.getAverageRatingForService = function(serviceId) {
  return this.aggregate([
    { $match: { service: serviceId, isPublic: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Review', reviewSchema);
