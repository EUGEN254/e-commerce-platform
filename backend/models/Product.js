import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Categorization
  category: {
    type: String,
    required: [true, 'Product category is required'],
  },
  subcategory: {
    type: String,
    required: [true, 'Product subcategory is required']
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required']
  },
  
  // Images
  mainImage: {
    type: String,
    required: [true, 'Main image is required']
  },
  images: [{
    type: String,
    required: [true, 'Product images are required']
  }],
  
  // Variants
  colors: [{
    name: String,
    hex: String,
    value: String
  }],
  sizes: [{
    type: String
  }],
  
  // Details
  tags: [{
    type: String
  }],
  features: [{
    type: String
  }],
  specs: {
    type: Map,
    of: String
  },
  
  // Stock & Status
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  
  // Ratings
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Status
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;