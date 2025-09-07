const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['haircut', 'beard', 'mustache', 'shampoo', 'styling', 'coloring', 'perm', 'straightening', 'other']
  },
  duration: {
    type: Number,
    required: [true, 'Service duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [300, 'Duration cannot exceed 300 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'SAR', 'AED']
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  requirements: [{
    type: String,
    enum: ['consultation', 'hair_wash', 'conditioner', 'styling_products', 'special_tools']
  }],
  barbers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber'
  }],
  tags: [String],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1, isPopular: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ averageRating: -1 });

// Virtual for formatted duration
serviceSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
});

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  return `${this.currency} ${this.price.toFixed(2)}`;
});

// Method to update rating
serviceSchema.methods.updateRating = function(newRating) {
  const totalRating = this.averageRating * this.reviewCount + newRating;
  this.reviewCount += 1;
  this.averageRating = totalRating / this.reviewCount;
  return this.save();
};

module.exports = mongoose.model('Service', serviceSchema);
