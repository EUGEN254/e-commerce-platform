import Category from "../../models/Category.js";
import mongoose from "mongoose";
import Product from "../../models/Product.js";
import{v2 as cloudinary} from"cloudinary";

// Utility function to delete images from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    const { cloudinary } = await import("cloudinary");
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};
// 1. GET ALL CATEGORIES
const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      type,
      featured,
      isActive,
      sortBy = "order",
      sortOrder = "asc",
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Featured filter
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    // Active filter
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const categories = await Category.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Category.countDocuments(query);

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category.id,
          isActive: true,
        });
        return {
          ...category,
          totalProducts: productCount,
        };
      })
    );

    console.log("Fetched categories with counts:", categoriesWithCounts);

    res.status(200).json({
      success: true,
      data: categoriesWithCounts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get All Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

// 2. GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

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

    // Get product count
    const productCount = await Product.countDocuments({
      category: category.id,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        totalProducts: productCount,
      },
    });
  } catch (error) {
    console.error("Get Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
    });
  }
};

// 3. CREATE CATEGORY WITH IMAGE UPLOADS
const createCategory = async (req, res) => {
  try {
    const {
      id,
      name,
      icon,
      path,
      type,
      isMainCategory,
      description,
      featured,
      order,
    } = req.body;

    // Parse subcategories from JSON strings if they exist
    let subcategories = [];
    let subcategoriesDetailed = [];

    if (req.body.subcategories) {
      try {
        subcategories = JSON.parse(req.body.subcategories);
      } catch (error) {
        console.error("Error parsing subcategories:", error);
        // If it's not valid JSON, try to handle as array or comma-separated string
        if (typeof req.body.subcategories === 'string') {
          if (req.body.subcategories.includes('[')) {
            // Try to parse as array string
            try {
              subcategories = JSON.parse(req.body.subcategories);
            } catch (e) {
              subcategories = req.body.subcategories.split(',').map(s => s.trim()).filter(Boolean);
            }
          } else {
            subcategories = req.body.subcategories.split(',').map(s => s.trim()).filter(Boolean);
          }
        } else if (Array.isArray(req.body.subcategories)) {
          subcategories = req.body.subcategories;
        }
      }
    }

    if (req.body.subcategoriesDetailed) {
      try {
        subcategoriesDetailed = JSON.parse(req.body.subcategoriesDetailed);
      } catch (error) {
        console.error("Error parsing subcategoriesDetailed:", error);
        // If it's not valid JSON, use empty array
        subcategoriesDetailed = [];
      }
    }

    console.log("Parsed subcategories:", subcategories);
    console.log("Parsed subcategoriesDetailed:", subcategoriesDetailed);

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

    // Process uploaded images - SIMPLE STRING URLs (like product creation)
    const imageFile = req.files?.image?.[0];
    const bannerFile = req.files?.bannerImage?.[0];

    let imageUrl = "";
    let bannerImageUrl = "";

    // Upload category image to Cloudinary (if provided)
    if (imageFile) {
      try {
        const imageResult = await cloudinary.uploader.upload(imageFile.path, {
          folder: "ecommerce/categories/images",
          public_id: `${id}-image-${Date.now()}`,
          overwrite: false,
        });
        imageUrl = imageResult.secure_url;
      } catch (uploadError) {
        console.error("Category image upload error:", uploadError);
        // Continue without image if upload fails
        imageUrl = "";
      }
    }

    // Upload banner image to Cloudinary (if provided)
    if (bannerFile) {
      try {
        const bannerResult = await cloudinary.uploader.upload(bannerFile.path, {
          folder: "ecommerce/categories/banners",
          public_id: `${id}-banner-${Date.now()}`,
          overwrite: false,
        });
        bannerImageUrl = bannerResult.secure_url;
      } catch (uploadError) {
        console.error("Banner image upload error:", uploadError);
        // Continue without banner if upload fails
        bannerImageUrl = "";
      }
    }

    // Create category - storing images as simple strings
    const categoryData = {
      id: id.toLowerCase(),
      name,
      icon,
      path,
      type: type.trim(),
      isMainCategory: isMainCategory === true || isMainCategory === "true",
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      subcategoriesDetailed: Array.isArray(subcategoriesDetailed) ? subcategoriesDetailed : [],
      description: description || "",
      featured: featured === true || featured === "true",
      order: order ? parseInt(order) : 0,
      image: imageUrl, // Simple string URL
      bannerImage: bannerImageUrl, // Simple string URL
      isActive: true,
    };

    console.log("Creating category with data:", categoryData);

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    // Clean up uploaded images if category creation fails
    if (req.files?.image?.[0]?.filename) {
      await deleteFromCloudinary(req.files.image[0].filename);
    }
    if (req.files?.bannerImage?.[0]?.filename) {
      await deleteFromCloudinary(req.files.bannerImage[0].filename);
    }

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

// 4. UPDATE CATEGORY WITH IMAGE UPLOADS
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

    // Store old image data for cleanup
    const oldImageData = { ...category.image };
    const oldBannerData = { ...category.bannerImage };

    // Process uploaded images
    const imageFile = req.files?.image?.[0];
    const bannerFile = req.files?.bannerImage?.[0];

    // Handle image updates
    if (imageFile) {
      updates.image = {
        url: imageFile.path || imageFile.url,
        publicId: imageFile.filename || imageFile.public_id,
      };
    }

    if (bannerFile) {
      updates.bannerImage = {
        url: bannerFile.path || bannerFile.url,
        publicId: bannerFile.filename || bannerFile.public_id,
      };
    }

    // Prevent updating ID if provided
    if (updates.id) {
      delete updates.id;
    }

    // Update category fields
    Object.keys(updates).forEach((key) => {
      category[key] = updates[key];
    });

    await category.save();

    // Delete old images from Cloudinary if new ones were uploaded
    if (imageFile && oldImageData.publicId) {
      await deleteFromCloudinary(oldImageData.publicId);
    }
    if (bannerFile && oldBannerData.publicId) {
      await deleteFromCloudinary(oldBannerData.publicId);
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    // Clean up newly uploaded images if update fails
    if (req.files?.image?.[0]?.filename) {
      await deleteFromCloudinary(req.files.image[0].filename);
    }
    if (req.files?.bannerImage?.[0]?.filename) {
      await deleteFromCloudinary(req.files.bannerImage[0].filename);
    }

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

// controllers/admin/adminCategory.js
const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const allowedUpdates = {};
    const allowed = ['isActive', 'featured'];
    
    Object.keys(updates).forEach((key) => {
      if (allowed.includes(key)) {
        allowedUpdates[key] = updates[key];
      }
    });

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { 
        new: true,
        runValidators: true,
        lean: true 
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    console.log('Update successful');

    res.json({ 
      success: true, 
      message: 'Category updated successfully', 
      data: updatedCategory 
    });
  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    
    res.status(500).json({ 
      success: false, 
      message: 'Error updating category status', 
      error: error.message 
    });
  }
};

// 5. DELETE CATEGORY (SOFT DELETE)
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

    // ACTUALLY DELETE THE CATEGORY FROM DATABASE
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Category.findByIdAndDelete(id);
    } else {
      await Category.findOneAndDelete({ id: id.toLowerCase() });
    }

    // Optionally: Clean up images from Cloudinary
    if (category.image) {
      try {
        // Extract public_id from Cloudinary URL if needed
        // This requires parsing the URL or storing public_id separately
        console.log("Category had image, might want to delete from Cloudinary:", category.image);
      } catch (cloudinaryError) {
        console.error("Error cleaning up Cloudinary image:", cloudinaryError);
        // Continue even if cleanup fails
      }
    }

    if (category.bannerImage) {
      try {
        console.log("Category had banner image, might want to delete from Cloudinary:", category.bannerImage);
      } catch (cloudinaryError) {
        console.error("Error cleaning up Cloudinary banner:", cloudinaryError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Category permanently deleted successfully",
      deletedCategory: {
        id: category.id,
        name: category.name,
        type: category.type,
      },
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 6. HARD DELETE CATEGORY (ADMIN ONLY - WITH IMAGE CLEANUP)
const hardDeleteCategory = async (req, res) => {
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

    // Check if category has products
    const productCount = await Product.countDocuments({
      category: category.id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} products. Reassign products first.`,
        productCount,
      });
    }

    // Delete images from Cloudinary
    if (category.image && category.image.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }
    if (category.bannerImage && category.bannerImage.publicId) {
      await deleteFromCloudinary(category.bannerImage.publicId);
    }

    // Delete from database
    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: "Category permanently deleted",
    });
  } catch (error) {
    console.error("Hard Delete Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Bulk update categories
const bulkUpdateCategories = async (req, res) => {
  try {
    const { categoryIds, updates } = req.body;

    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide category IDs",
      });
    }

    // Validate updates object
    const allowedUpdates = ["isActive", "featured", "type", "order"];
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        message: "Invalid update fields",
      });
    }

    // Update categories
    const result = await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $set: updates },
      { new: true }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} categories updated successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error bulk updating categories:", error);
    res.status(500).json({
      success: false,
      message: "Error updating categories",
      error: error.message,
    });
  }
};

// Bulk delete categories
const bulkDeleteCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide category IDs to delete",
      });
    }

    // Check if any category has products
    const categoriesWithProducts = await Product.find({
      categoryId: { $in: categoryIds },
    }).distinct("categoryId");

    if (categoriesWithProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Some categories have products. Delete products first or move them to another category.",
      });
    }

    // Delete categories
    const result = await Category.deleteMany({
      _id: { $in: categoryIds },
    });

    res.json({
      success: true,
      message: `${result.deletedCount} categories deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting categories",
      error: error.message,
    });
  }
};

// Update category order
const updateCategoryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    if (order === undefined || order === null) {
      return res.status(400).json({
        success: false,
        message: "Please provide order number",
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: { order: parseInt(order) } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category order updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating category order",
      error: error.message,
    });
  }
};

// Get products count by category
const getProductsCountByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Count products in this category
    const productCount = await Product.countDocuments({ categoryId: id });

    // Also count in subcategories if needed
    const category = await Category.findById(id);
    let totalCount = productCount;

    if (
      category &&
      category.subcategories &&
      category.subcategories.length > 0
    ) {
      // If you want to include products from subcategories
      // This depends on your data structure
    }

    // Update the category's product count
    await Category.findByIdAndUpdate(id, {
      $set: { totalProducts: totalCount },
    });

    res.json({
      success: true,
      count: totalCount,
      data: { totalProducts: totalCount },
    });
  } catch (error) {
    console.error("Error getting products count:", error);
    res.status(500).json({
      success: false,
      message: "Error getting products count",
      error: error.message,
    });
  }
};

// Get all categories with products count
const getAllCategoriesWithProducts = async (req, res) => {
  try {
    const { includeProductsCount = true } = req.query;

    let categories = await Category.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (includeProductsCount) {
      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Product.countDocuments({
            categoryId: category._id,
          });

          return {
            ...category,
            totalProducts: productCount,
          };
        })
      );

      categories = categoriesWithCounts;
    }

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting categories with products:", error);
    res.status(500).json({
      success: false,
      message: "Error getting categories",
      error: error.message,
    });
  }
};

// Get category statistics
const getCategoryStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    const featuredCategories = await Category.countDocuments({
      featured: true,
    });
    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      data: {
        totalCategories,
        totalProducts,
        activeCategories,
        featuredCategories,
      },
    });
  } catch (error) {
    console.error("Error getting category stats:", error);
    res.status(500).json({
      success: false,
      message: "Error getting statistics",
      error: error.message,
    });
  }
};

// Get products count for all categories
const getProductsCountForAllCategories = async (req, res) => {
  try {
    // Get all categories (including inactive if needed)
    const categories = await Category.find({})
      .sort({ order: 1, name: 1 })
      .lean();
    
    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Count products in this category
        // Adjust field name based on your Product model
        const productCount = await Product.countDocuments({ 
          $or: [
            { category: category.id },        // If Product has 'category' field
            { categoryId: category.id },      // If Product has 'categoryId' field
            { categoryId: category._id },     // If Product has categoryId as ObjectId
            { "categories": category.id }     // If Product has categories array
          ]
        });
        
        return {
          ...category,
          totalProducts: productCount || 0
        };
      })
    );
    
    // Calculate summary statistics
    const totalCategories = categories.length;
    const totalProducts = categoriesWithCounts.reduce((sum, cat) => sum + (cat.totalProducts || 0), 0);
    const categoriesWithProducts = categoriesWithCounts.filter(cat => (cat.totalProducts || 0) > 0).length;
    
    res.json({
      success: true,
      count: categories.length,
      data: categoriesWithCounts,
      summary: {
        totalCategories,
        totalProducts,
        categoriesWithProducts,
        categoriesWithoutProducts: totalCategories - categoriesWithProducts
      }
    });
  } catch (error) {
    console.error('Error getting products count for all categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products count for categories',
      error: error.message
    });
  }
};


export {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  hardDeleteCategory,
  bulkUpdateCategories,
  bulkDeleteCategories,
  updateCategoryOrder,
  getProductsCountByCategory,
  getAllCategoriesWithProducts,
  getCategoryStats,
  updateCategoryStatus,
  getProductsCountForAllCategories,
};
