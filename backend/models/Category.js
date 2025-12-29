// models/Category.js
import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  totalProducts: { type: Number, default: 0 }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, trim: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  icon: { type: String, required: true, trim: true },
  path: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    required: true,
    trim: true, 
    default: 'main' 
  },
  isMainCategory: { type: Boolean, default: false },
  subcategories: { type: [String], default: [] },
  subcategoriesDetailed: [subcategorySchema],
  description: { type: String, default: '' },
  totalProducts: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  

  image: {
    type: String,
    default: ''
  },
  
  bannerImage: {
    type: String,
    default: ''
  },
  
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create indexes
categorySchema.index({ type: 1 });
categorySchema.index({ isMainCategory: 1 });
categorySchema.index({ isActive: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;