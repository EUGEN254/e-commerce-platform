const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Validate that wishlist items contain unique products
wishlistSchema.path('items').validate(function(value) {
  const productIds = value.map(item => item.product.toString());
  return new Set(productIds).size === productIds.length;
}, 'Product already in wishlist');

// Indexes
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);