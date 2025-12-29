// backend/controllers/admin/adminProduct.js
import { v2 as cloudinary } from "cloudinary";
import Product from "../../models/Product.js";
import logger from "../../utils/logger.js";

// Create Product Controller (already exists, keep it)
const createProduct = async (req, res) => {
  try {
    logger.info("Received files:", req.files);
    logger.info("Received body:", req.body);

    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      discount,
      category,
      subcategory,
      brand,
      colors,
      sizes,
      tags,
      features,
      specs,
      stock,
      inStock,
      isFeatured,
      status,
    } = req.body;

    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    // Required fields validation
    const requiredFields = { 
      name: "Product name", 
      description: "Product description", 
      price: "Product price", 
      category: "Product category", 
      subcategory: "Product subcategory", 
      brand: "Product brand", 
      stock: "Product stock" 
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field] && req.body[field] !== 0)
      .map(([, fieldName]) => fieldName);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(", ")}` 
      });
    }

    // Get uploaded files
    const mainImageFile = req.files?.mainImage ? req.files.mainImage[0] : null;
    const additionalImageFiles = req.files?.images ? req.files.images : [];

    if (!mainImageFile) {
      return res.status(400).json({ 
        success: false, 
        message: "Main product image is required" 
      });
    }

    // Parse JSON strings
    const parseArray = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (error) {
          // If not valid JSON, try comma-separated
          if (data.includes(",")) {
            return data.split(",").map(item => item.trim()).filter(Boolean);
          }
          return [data.trim()];
        }
      }
      return [];
    };

    const parseColors = (colorsData) => {
      if (!colorsData) return [];
      if (Array.isArray(colorsData)) {
        return colorsData.map(color => {
          if (typeof color === "string") {
            return { name: color, value: color.toLowerCase() };
          }
          return color;
        });
      }
      return [];
    };

    const parseSpecs = (specsData) => {
      if (!specsData) return {};
      if (typeof specsData === "object") return specsData;
      if (typeof specsData === "string") {
        try {
          return JSON.parse(specsData);
        } catch (error) {
          return {};
        }
      }
      return {};
    };

    // Upload main image to Cloudinary
    let mainImageUrl = "";
    if (mainImageFile) {
      try {
        const mainImageResult = await cloudinary.uploader.upload(mainImageFile.path, {
          folder: "ecommerce/products/main",
          public_id: `${name.replace(/\s+/g, "-").toLowerCase()}-main-${Date.now()}`,
          overwrite: false,
        });
        mainImageUrl = mainImageResult.secure_url;
      } catch (uploadError) {
        logger.error("Main image upload error:", uploadError);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to upload main image" 
        });
      }
    }

    // Upload additional images to Cloudinary
    let additionalImageUrls = [];
    if (additionalImageFiles.length > 0) {
      try {
        const uploadPromises = additionalImageFiles.map((file, index) => 
          cloudinary.uploader.upload(file.path, {
            folder: "ecommerce/products/additional",
            public_id: `${name.replace(/\s+/g, "-").toLowerCase()}-additional-${Date.now()}-${index}`,
            overwrite: false,
          })
        );

        const additionalResults = await Promise.all(uploadPromises);
        additionalImageUrls = additionalResults.map(result => result.secure_url);
      } catch (uploadError) {
        logger.error("Additional images upload error:", uploadError);
        // Continue with product creation even if additional images fail
        additionalImageUrls = [];
      }
    }

    // Combine all image URLs
    const allImageUrls = [mainImageUrl, ...additionalImageUrls].filter(Boolean);

    // Build product object
    const productData = {
      name: name.trim(),
      description: description.trim(),
      shortDescription: shortDescription ? shortDescription.trim() : description.substring(0, 200).trim(),
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      category: category.toLowerCase(),
      subcategory: subcategory.toLowerCase(),
      brand: brand.trim(),
      mainImage: mainImageUrl,
      images: allImageUrls,
      colors: parseColors(colors),
      sizes: parseArray(sizes),
      tags: parseArray(tags),
      features: parseArray(features),
      specs: parseSpecs(specs),
      stock: parseInt(stock) || 0,
      inStock: inStock === true || inStock === "true" || (parseInt(stock) || 0) > 0,
      isFeatured: isFeatured === true || isFeatured === "true",
      status: status || "active",
      rating: 0,
      reviewCount: 0,
      createdBy: admin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create product in database
    const product = await Product.create(productData);

    res.status(201).json({ 
      success: true, 
      message: "Product created successfully", 
      data: product
    });

  } catch (error) {
    logger.error("Create Product Error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error", 
        errors 
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        message: `Product with this ${field} already exists` 
      });
    }

    // Handle other errors
    res.status(500).json({ 
      success: false, 
      message: "Server error while creating product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Get All Products with Pagination and Filters
const getAllProducts = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.category && req.query.category !== 'all') {
      // Case-insensitive category filter
      filter.category = { $regex: `^${req.query.category}$`, $options: 'i' };
    }
    
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    if (req.query.stock && req.query.stock !== 'all') {
      if (req.query.stock === 'inStock') {
        filter.inStock = true;
      } else if (req.query.stock === 'outOfStock') {
        filter.inStock = false;
      } else if (req.query.stock === 'lowStock') {
        filter.stock = { $gt: 0, $lt: 10 };
      }
    }
    
    if (req.query.isFeatured) {
      filter.isFeatured = req.query.isFeatured === 'true';
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v -createdBy -updatedAt')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error("Get All Products Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Get Single Product by ID
const getProductById = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const { id } = req.params;
    
    const product = await Product.findById(id)
      .select('-__v -createdBy')
      .lean();

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error("Get Product by ID Error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Update Product by ID
const updateProduct = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      discount,
      category,
      subcategory,
      brand,
      colors,
      sizes,
      tags,
      features,
      specs,
      stock,
      inStock,
      isFeatured,
      status,
    } = req.body;

    // Parse JSON strings
    const parseArray = (data) => {
      if (!data) return null; // Return null to indicate no change
      if (Array.isArray(data)) return data;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (error) {
          if (data.includes(",")) {
            return data.split(",").map(item => item.trim()).filter(Boolean);
          }
          return [data.trim()];
        }
      }
      return null;
    };

    const parseColors = (colorsData) => {
      if (!colorsData) return null;
      if (Array.isArray(colorsData)) {
        return colorsData.map(color => {
          if (typeof color === "string") {
            return { name: color, value: color.toLowerCase() };
          }
          return color;
        });
      }
      return null;
    };

    const parseSpecs = (specsData) => {
      if (!specsData) return null;
      if (typeof specsData === "object") return specsData;
      if (typeof specsData === "string") {
        try {
          return JSON.parse(specsData);
        } catch (error) {
          return {};
        }
      }
      return null;
    };

    // Handle image updates
    const mainImageFile = req.files?.mainImage ? req.files.mainImage[0] : null;
    const additionalImageFiles = req.files?.images ? req.files.images : [];

    let mainImageUrl = existingProduct.mainImage;
    let additionalImageUrls = existingProduct.images;

    // Upload new main image if provided
    if (mainImageFile) {
      try {
        // Delete old main image from Cloudinary if it exists
        if (existingProduct.mainImage) {
          const publicId = existingProduct.mainImage.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`ecommerce/products/main/${publicId}`);
        }
        
        const mainImageResult = await cloudinary.uploader.upload(mainImageFile.path, {
          folder: "ecommerce/products/main",
          public_id: `${(name || existingProduct.name).replace(/\s+/g, "-").toLowerCase()}-main-${Date.now()}`,
          overwrite: false,
        });
        mainImageUrl = mainImageResult.secure_url;
      } catch (uploadError) {
        logger.error("Main image upload error:", uploadError);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to upload main image" 
        });
      }
    }

    // Upload new additional images if provided
    if (additionalImageFiles.length > 0) {
      try {
        // Delete old additional images from Cloudinary
        if (existingProduct.images && existingProduct.images.length > 0) {
          for (const imageUrl of existingProduct.images) {
            if (imageUrl !== existingProduct.mainImage) {
              const publicId = imageUrl.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(`ecommerce/products/additional/${publicId}`);
            }
          }
        }
        
        const uploadPromises = additionalImageFiles.map((file, index) => 
          cloudinary.uploader.upload(file.path, {
            folder: "ecommerce/products/additional",
            public_id: `${(name || existingProduct.name).replace(/\s+/g, "-").toLowerCase()}-additional-${Date.now()}-${index}`,
            overwrite: false,
          })
        );

        const additionalResults = await Promise.all(uploadPromises);
        additionalImageUrls = additionalResults.map(result => result.secure_url);
      } catch (uploadError) {
        logger.error("Additional images upload error:", uploadError);
        additionalImageUrls = existingProduct.images;
      }
    }

    // Prepare update data
    const updateData = {
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      ...(shortDescription && { shortDescription: shortDescription.trim() }),
      ...(price && { price: parseFloat(price) }),
      ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
      ...(discount !== undefined && { discount: parseFloat(discount) }),
      ...(category && { category: category.toLowerCase() }),
      ...(subcategory && { subcategory: subcategory.toLowerCase() }),
      ...(brand && { brand: brand.trim() }),
      ...(mainImageUrl && { mainImage: mainImageUrl }),
      ...(additionalImageUrls.length > 0 && { images: additionalImageUrls }),
      ...(colors && { colors: parseColors(colors) || existingProduct.colors }),
      ...(sizes && { sizes: parseArray(sizes) || existingProduct.sizes }),
      ...(tags && { tags: parseArray(tags) || existingProduct.tags }),
      ...(features && { features: parseArray(features) || existingProduct.features }),
      ...(specs && { specs: parseSpecs(specs) || existingProduct.specs }),
      ...(stock !== undefined && { 
        stock: parseInt(stock),
        inStock: parseInt(stock) > 0
      }),
      ...(inStock !== undefined && { 
        inStock: inStock === true || inStock === "true" 
      }),
      ...(isFeatured !== undefined && { 
        isFeatured: isFeatured === true || isFeatured === "true" 
      }),
      ...(status && { status }),
      updatedAt: new Date()
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v -createdBy');

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    logger.error("Update Product Error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error", 
        errors 
      });
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        message: `Product with this ${field} already exists` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to update product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Delete Product by ID
const deleteProduct = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Delete images from Cloudinary
    try {
      // Delete main image
      if (product.mainImage) {
        const mainPublicId = product.mainImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`ecommerce/products/main/${mainPublicId}`);
      }
      
      // Delete additional images
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          if (imageUrl !== product.mainImage) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`ecommerce/products/additional/${publicId}`);
          }
        }
      }
    } catch (cloudinaryError) {
      logger.error("Cloudinary deletion error:", cloudinaryError);
      // Continue with product deletion even if image deletion fails
    }

    // Delete product from database
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    logger.error("Delete Product Error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Update Product Status
const updateProductStatus = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status. Must be 'active' or 'inactive'" 
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).select('_id name status');

    res.status(200).json({
      success: true,
      message: `Product status updated to ${status}`,
      data: updatedProduct
    });
  } catch (error) {
    logger.error("Update Product Status Error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to update product status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Toggle Featured Status
const toggleFeatured = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        isFeatured: !product.isFeatured,
        updatedAt: new Date() 
      },
      { new: true }
    ).select('_id name isFeatured');

    res.status(200).json({
      success: true,
      message: updatedProduct.isFeatured 
        ? "Product marked as featured" 
        : "Product removed from featured",
      data: updatedProduct
    });
  } catch (error) {
    logger.error("Toggle Featured Error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to toggle featured status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Bulk Delete Products
const bulkDeleteProducts = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide an array of product IDs to delete" 
      });
    }

    // Find products to get their images
    const products = await Product.find({ _id: { $in: ids } });
    
    // Delete images from Cloudinary
    for (const product of products) {
      try {
        // Delete main image
        if (product.mainImage) {
          const mainPublicId = product.mainImage.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`ecommerce/products/main/${mainPublicId}`);
        }
        
        // Delete additional images
        if (product.images && product.images.length > 0) {
          for (const imageUrl of product.images) {
            if (imageUrl !== product.mainImage) {
              const publicId = imageUrl.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(`ecommerce/products/additional/${publicId}`);
            }
          }
        }
      } catch (cloudinaryError) {
        logger.error("Cloudinary deletion error for product", product._id, ":", cloudinaryError);
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete products from database
    const result = await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} products`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    logger.error("Bulk Delete Products Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Bulk Update Products
const bulkUpdateProducts = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const { ids, data } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide an array of product IDs to update" 
      });
    }

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide data to update" 
      });
    }

    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // Update products
    const result = await Product.updateMany(
      { _id: { $in: ids } },
      updateData,
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    logger.error("Bulk Update Products Error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error", 
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to update products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Get Product Statistics
const getProductStats = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const stats = await Product.aggregate([
      {
        $facet: {
          totalProducts: [{ $count: "count" }],
          categoryStats: [
            { $group: { _id: "$category", count: { $sum: 1 } } }
          ],
          statusStats: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          stockStats: [
            { 
              $group: { 
                _id: null,
                totalStock: { $sum: "$stock" },
                totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
                lowStock: { $sum: { $cond: [{ $and: [{ $gt: ["$stock", 0] }, { $lt: ["$stock", 10] }] }, 1, 0] } },
                outOfStock: { $sum: { $cond: [{ $eq: ["$inStock", false] }, 1, 0] } }
              }
            }
          ],
          featuredStats: [
            { $match: { isFeatured: true } },
            { $count: "count" }
          ],
          topProducts: [
            { $sort: { rating: -1, reviewCount: -1 } },
            { $limit: 5 },
            { $project: { _id: 1, name: 1, rating: 1, reviewCount: 1, price: 1, mainImage: 1 } }
          ]
        }
      }
    ]);

    const formattedStats = {
      total: stats[0].totalProducts[0]?.count || 0,
      categories: stats[0].categoryStats,
      statuses: stats[0].statusStats,
      stock: stats[0].stockStats[0] || {},
      featured: stats[0].featuredStats[0]?.count || 0,
      topProducts: stats[0].topProducts
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    logger.error("Get Product Stats Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch product statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Export all controllers
export { 
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  toggleFeatured,
  bulkDeleteProducts,
  bulkUpdateProducts,
  getProductStats
};