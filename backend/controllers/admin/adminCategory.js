// controllers/categoryController.js - COMPLETE UPDATED VERSION

import mongoose from "mongoose";
import Product from "../../models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "../../utils/logger.js";
import { safeDeleteCloudinaryResource } from "../../utils/cloudinaryHelper.js";
import Category from "../../models/Category.js";

// Delete Cloudinary resource with retry and timeout handling
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await safeDeleteCloudinaryResource(publicId);
  } catch (error) {
    logger.warn(`Failed to delete Cloudinary resource ${publicId}:`, error.message);
    // Silently handle cleanup errors
  }
};

// Map product types to their default size attribute
const getDefaultSizeMeaning = (productType) => {
  const mappings = {
    'phone': 'storage-capacity',
    'laptop': 'storage-ram',
    'tablet': 'storage',
    't-shirt': 'clothing-size',
    'shirt': 'clothing-size',
    'pants': 'clothing-size',
    'jeans': 'clothing-size',
    'shoes': 'shoe-size',
    'sneakers': 'shoe-size',
    'boots': 'shoe-size',
    'watch': 'watch-size',
    'book': 'book-type',
    'furniture': 'dimensions',
    'bag': 'bag-size',
    'jacket': 'clothing-size',
    'default': 'standard-size'
  };
  
  return mappings[productType] || mappings.default;
};

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
        { productType: { $regex: search, $options: "i" } }, // Added productType to search
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
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const {
      id,
      name,
      icon,
      path,
      type,
      productType, // NEW FIELD
      isMainCategory,
      description,
      featured,
      sizeMeaning, // NEW FIELD
    } = req.body;

    // Parse data from JSON strings if they exist
    let subcategories = [];
    let subcategoriesDetailed = [];
    let defaultColors = []; // NEW
    let defaultSizes = []; // NEW

    // Parse subcategories
    if (req.body.subcategories) {
      try {
        subcategories = JSON.parse(req.body.subcategories);
      } catch (error) {
        if (typeof req.body.subcategories === "string") {
          if (req.body.subcategories.includes("[")) {
            try {
              subcategories = JSON.parse(req.body.subcategories);
            } catch (e) {
              subcategories = req.body.subcategories
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
          } else {
            subcategories = req.body.subcategories
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        } else if (Array.isArray(req.body.subcategories)) {
          subcategories = req.body.subcategories;
        }
      }
    }

    // Parse subcategoriesDetailed
    if (req.body.subcategoriesDetailed) {
      try {
        subcategoriesDetailed = JSON.parse(req.body.subcategoriesDetailed);
      } catch (error) {
        subcategoriesDetailed = [];
      }
    }

    // NEW: Parse defaultColors
    if (req.body.defaultColors) {
      try {
        defaultColors = JSON.parse(req.body.defaultColors);
      } catch (error) {
        if (Array.isArray(req.body.defaultColors)) {
          defaultColors = req.body.defaultColors;
        } else {
          defaultColors = [];
        }
      }
    }

    // NEW: Parse defaultSizes
    if (req.body.defaultSizes) {
      try {
        defaultSizes = JSON.parse(req.body.defaultSizes);
      } catch (error) {
        if (Array.isArray(req.body.defaultSizes)) {
          defaultSizes = req.body.defaultSizes;
        } else {
          defaultSizes = [];
        }
      }
    }

    // Required fields validation - ADDED productType
    const requiredFields = {
      id: "Category ID",
      name: "Category name",
      icon: "Category icon",
      path: "Category path",
      type: "Category type",
      productType: "Product type", // NEW REQUIRED FIELD
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

    // Process uploaded images
    const imageFile = req.files?.image?.[0];
    const bannerFile = req.files?.bannerImage?.[0];

    let imageUrl = "";
    let bannerImageUrl = "";

    // Upload category image to Cloudinary
    if (imageFile) {
      try {
        const imageResult = await cloudinary.uploader.upload(imageFile.path, {
          folder: "ecommerce/categories/images",
          public_id: `${id}-image-${Date.now()}`,
          overwrite: false,
        });
        imageUrl = imageResult.secure_url;
      } catch (uploadError) {
        imageUrl = "";
      }
    }

    // Upload banner image to Cloudinary
    if (bannerFile) {
      try {
        const bannerResult = await cloudinary.uploader.upload(bannerFile.path, {
          folder: "ecommerce/categories/banners",
          public_id: `${id}-banner-${Date.now()}`,
          overwrite: false,
        });
        bannerImageUrl = bannerResult.secure_url;
      } catch (uploadError) {
        bannerImageUrl = "";
      }
    }

    // Build category data with all fields
    const categoryData = {
      id: id.toLowerCase(),
      name,
      icon,
      path,
      type: type.trim(),
      productType: productType.trim(), // NEW
      defaultColors: Array.isArray(defaultColors) ? defaultColors : [], // NEW
      defaultSizes: Array.isArray(defaultSizes) ? defaultSizes : [], // NEW
      sizeMeaning: sizeMeaning || getDefaultSizeMeaning(productType), // NEW
      isMainCategory: isMainCategory === true || isMainCategory === "true",
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      subcategoriesDetailed: Array.isArray(subcategoriesDetailed)
        ? subcategoriesDetailed
        : [],
      description: description || "",
      featured: featured === true || featured === "true",
      image: imageUrl,
      bannerImage: bannerImageUrl,
      isActive: true,
    };

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
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

    // Parse data from JSON strings if needed
    const fieldsToParse = [
      'subcategories',
      'subcategoriesDetailed',
      'defaultColors', // NEW
      'defaultSizes'   // NEW
    ];

    fieldsToParse.forEach(field => {
      if (updates[field] && typeof updates[field] === "string") {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch (error) {
          // If parsing fails, keep as is
        }
      }
    });

    // Auto-set sizeMeaning if productType changes but sizeMeaning not provided
    if (updates.productType && !updates.sizeMeaning) {
      updates.sizeMeaning = getDefaultSizeMeaning(updates.productType);
    }

    // Store old image URLs for cleanup
    const oldImageUrl = category.image;
    const oldBannerUrl = category.bannerImage;

    // Process uploaded images
    const imageFile = req.files?.image?.[0];
    const bannerFile = req.files?.bannerImage?.[0];

    // Handle image updates
    if (imageFile) {
      try {
        const imageResult = await cloudinary.uploader.upload(imageFile.path, {
          folder: "ecommerce/categories/images",
          public_id: `${updates.id || category.id}-image-${Date.now()}`,
          overwrite: false,
        });
        updates.image = imageResult.secure_url;
      } catch (uploadError) {
        updates.image = category.image;
      }
    }

    if (bannerFile) {
      try {
        const bannerResult = await cloudinary.uploader.upload(bannerFile.path, {
          folder: "ecommerce/categories/banners",
          public_id: `${updates.id || category.id}-banner-${Date.now()}`,
          overwrite: false,
        });
        updates.bannerImage = bannerResult.secure_url;
      } catch (uploadError) {
        updates.bannerImage = category.bannerImage;
      }
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
    if (imageFile && oldImageUrl) {
      // Extract public ID from Cloudinary URL
      try {
        const publicId = oldImageUrl.split('/').pop().split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        logger.warn('Failed to extract public ID from old image URL');
      }
    }
    if (bannerFile && oldBannerUrl) {
      try {
        const publicId = oldBannerUrl.split('/').pop().split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        logger.warn('Failed to extract public ID from old banner URL');
      }
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
    
  } catch (error) {
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

const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const allowedUpdates = {};
    const allowed = ["isActive", "featured"];

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
        lean: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category status",
      error: error.message,
    });
  }
};

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

    // Delete from database
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Category.findByIdAndDelete(id);
    } else {
      await Category.findOneAndDelete({ id: id.toLowerCase() });
    }

    // Delete images from Cloudinary
    if (category.image) {
      try {
        const publicId = category.image.split('/').pop().split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        logger.warn('Failed to delete category image from Cloudinary');
      }
    }
    
    if (category.bannerImage) {
      try {
        const publicId = category.bannerImage.split('/').pop().split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        logger.warn('Failed to delete category banner from Cloudinary');
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
    if (category.image) {
      try {
        const publicId = category.image.split('/').pop().split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        logger.warn('Failed to delete category image from Cloudinary');
      }
    }
    
    if (category.bannerImage) {
      try {
        const publicId = category.bannerImage.split('/').pop().split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        logger.warn('Failed to delete category banner from Cloudinary');
      }
    }

    // Delete from database
    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: "Category permanently deleted",
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const bulkUpdateCategories = async (req, res) => {
  try {
    const { categoryIds, updates } = req.body;

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide category IDs",
      });
    }

    // Validate updates object
    const allowedUpdates = ["isActive", "featured", "type"];
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
    res.status(500).json({
      success: false,
      message: "Error updating categories",
      error: error.message,
    });
  }
};

const bulkDeleteCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
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

    // Get categories to delete their images
    const categories = await Category.find({ _id: { $in: categoryIds } });
    
    // Delete images from Cloudinary
    for (const category of categories) {
      if (category.image) {
        try {
          const publicId = category.image.split('/').pop().split('.')[0];
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        } catch (error) {
          logger.warn(`Failed to delete image for category ${category.name}`);
        }
      }
      
      if (category.bannerImage) {
        try {
          const publicId = category.bannerImage.split('/').pop().split('.')[0];
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        } catch (error) {
          logger.warn(`Failed to delete banner for category ${category.name}`);
        }
      }
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
    res.status(500).json({
      success: false,
      message: "Error deleting categories",
      error: error.message,
    });
  }
};

const getProductsCountByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productCount = await Product.countDocuments({ categoryId: id });

    const category = await Category.findById(id);
    let totalCount = productCount;

    if (category && category.subcategories && category.subcategories.length > 0) {
      // Include products from subcategories if needed
    }

    await Category.findByIdAndUpdate(id, {
      $set: { totalProducts: totalCount },
    });

    res.json({
      success: true,
      count: totalCount,
      data: { totalProducts: totalCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting products count",
      error: error.message,
    });
  }
};

const getAllCategoriesWithProducts = async (req, res) => {
  try {
    const { includeProductsCount = true } = req.query;

    let categories = await Category.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (includeProductsCount) {
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
    res.status(500).json({
      success: false,
      message: "Error getting categories",
      error: error.message,
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: "Error getting statistics",
      error: error.message,
    });
  }
};

const getProductsCountForAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ order: 1, name: 1 })
      .lean();

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          $or: [
            { category: category.id },
            { categoryId: category.id },
            { categoryId: category._id },
            { categories: category.id },
          ],
        });

        return {
          ...category,
          totalProducts: productCount || 0,
        };
      })
    );

    const totalCategories = categories.length;
    const totalProducts = categoriesWithCounts.reduce(
      (sum, cat) => sum + (cat.totalProducts || 0),
      0
    );
    const categoriesWithProducts = categoriesWithCounts.filter(
      (cat) => (cat.totalProducts || 0) > 0
    ).length;

    res.json({
      success: true,
      count: categories.length,
      data: categoriesWithCounts,
      summary: {
        totalCategories,
        totalProducts,
        categoriesWithProducts,
        categoriesWithoutProducts: totalCategories - categoriesWithProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products count for categories",
      error: error.message,
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
  getProductsCountByCategory,
  getAllCategoriesWithProducts,
  getCategoryStats,
  updateCategoryStatus,
  getProductsCountForAllCategories,
};