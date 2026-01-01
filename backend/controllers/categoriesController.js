import Category from "../models/Category.js";
import Product from "../models/Product.js";


// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const {
      type,
      isMainCategory,
      featured,
      sort = "order",
      limit,
    } = req.query;

    // Parse booleans properly (default active to true if unspecified)
    const active = req.query.active !== undefined ? req.query.active === 'true' : true;
    const parsedIsMainCategory = isMainCategory !== undefined ? isMainCategory === 'true' : undefined;
    const parsedFeatured = featured !== undefined ? featured === 'true' : undefined;

    // Build filter
    const filter = {};
    if (type) {
      filter.type = type;
    }
    if (parsedIsMainCategory !== undefined) {
      filter.isMainCategory = parsedIsMainCategory;
    }
    if (parsedFeatured !== undefined) {
      filter.featured = parsedFeatured;
    }
    if (active !== undefined) {  // This will always add it unless explicitly set to undefined (but defaults to true)
      filter.isActive = active;
    }

    // Build query
    let query = Category.find(filter);

    // Sort
    const sortOrder = {};
    if (sort === "name") {
      sortOrder.name = 1;
    } else if (sort === "totalProducts") {
      sortOrder.totalProducts = -1;
    } else {
      sortOrder.order = 1;
      sortOrder.createdAt = 1;
    }
    query = query.sort(sortOrder);

    // Limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const categories = await query;
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get products by category AND subcategory
const getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const inStock = req.query.inStock === 'true';
    const featured = req.query.featured === 'true';
    
    // Build filter
    const filter = {
      category: category,
      subcategory: subcategory,
      status: 'active'
    };
    
    // Apply price filter if provided
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      filter.price = {};
      if (!isNaN(minPrice)) filter.price.$gte = minPrice;
      if (!isNaN(maxPrice)) filter.price.$lte = maxPrice;
    }
    
    // Apply stock filter if requested
    if (inStock) {
      filter.$or = [
        { stock: { $gt: 0 } },
        { inStock: true },
        { stock: { $exists: false } }
      ];
    }
    
    // Apply featured filter if requested
    if (featured) {
      filter.isFeatured = true;
    }
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder;
    
    // Get products with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v -updatedAt');
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      page,
      totalPages,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Determine whether `id` is a MongoDB ObjectId or a category identifier string
    let category;
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    } else {
      category = await Category.findOne({ id: id.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Only return active categories for non-admins
    if (!req.user || req.user.role !== "admin") {
      if (!category.isActive) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get categories by type
const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { active = true } = req.query;

    const filter = { type: type.toLowerCase() };

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    const categories = await Category.find(filter).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get main categories
const getMainCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isMainCategory: true,
      isActive: true,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get featured categories
const getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      featured: true,
      isActive: true,
    })
      .sort({ order: 1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update category product count
const updateCategoryProductCount = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (category) {
      // Count products in this category (you need to import Product model)
      const Product = (await import("../models/Product.js")).default;
      const productCount = await Product.countDocuments({
        category: category.id,
        status: "active",
      });

      category.totalProducts = productCount;
      await category.save();
    }
  } catch (error) {
  }
};

export {
  getAllCategories,
  getCategoryById,
  getCategoriesByType,
  getMainCategories,
  getFeaturedCategories,
  updateCategoryProductCount,
  getProductsByCategoryAndSubcategory,
};