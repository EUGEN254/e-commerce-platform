import Category from "../models/Category.js";


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
    console.error("Get All Categories Error:", error);
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

    // Check if ID is MongoDB ObjectId or category id string
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
    console.error("Get Category By ID Error:", error);
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
    console.error("Get Categories By Type Error:", error);
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
    console.error("Get Main Categories Error:", error);
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
    console.error("Get Featured Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Create category (Admin only)
const createCategory = async (req, res) => {
  try {
    const {
      id,
      name,
      icon,
      path,
      type,
      isMainCategory,
      subcategories,
      description,
      totalProducts,
      featured,
      order,
    } = req.body;

    // Required fields validation
    const requiredFields = {
      id: "Category ID",
      name: "Category name",
      icon: "Category icon",
      path: "Category path",
      type: "Category type",
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      if (!req.body[field]) {
        missingFields.push(fieldName);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check if category ID already exists
    const existingCategory = await Category.findOne({
      id: id.toLowerCase(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category ID already exists",
      });
    }

    // Create category
    const categoryData = {
      id: id.toLowerCase(),
      name,
      icon,
      path,
      type: type.toLowerCase(),
      isMainCategory: isMainCategory || false,
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      description: description || "",
      totalProducts: totalProducts || 0,
      featured: featured || false,
      order: order || 0,
      isActive: true,
    };

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category ID already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find category
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

    // Prevent updating ID if provided
    if (updates.id) {
      delete updates.id;
    }

    // Update category
    Object.keys(updates).forEach((key) => {
      category[key] = updates[key];
    });

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find category
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

    // Instead of deleting, mark as inactive (soft delete)
    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
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
    console.error("Update Category Product Count Error:", error);
  }
};

export {
  getAllCategories,
  getCategoryById,
  getCategoriesByType,
  getMainCategories,
  getFeaturedCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryProductCount,
};