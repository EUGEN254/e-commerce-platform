// models/Category.js - SIMPLIFIED & PRACTICAL
import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: String,
  hex: String,
  type: String, // finish, fabric, upper, etc.
  value: String,
});

const subcategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  totalProducts: { type: Number, default: 0 },
});

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    path: { type: String, required: true },

    // This determines what colors/sizes mean
    productType: { type: String, required: true },
    // Examples: "phone", "laptop", "t-shirt", "shoes", "watch", "book"

    // Default colors for this category
    defaultColors: [colorSchema],

    // Default sizes for this category
    defaultSizes: [String],

    // Size labels - what do sizes represent?
    sizeMeaning: String, // "clothing-size", "shoe-size", "storage", "screen-size"

    isMainCategory: { type: Boolean, default: false },
    subcategories: [String],
    subcategoriesDetailed: [subcategorySchema],
    description: String,
    totalProducts: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    image: String,
    bannerImage: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
