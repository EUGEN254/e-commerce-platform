import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

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
      isFeatured,
      status,
    } = req.body;

    // Required fields validation
    const requiredFields = {
      name: "Product name",
      description: "Product description",
      price: "Product price",
      category: "Product category",
      subcategory: "Product subcategory",
      brand: "Product brand",
      stock: "Product stock",
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, fieldName]) => {
      if (!req.body[field] && req.body[field] !== 0) {
        missingFields.push(fieldName);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Parse arrays from string if needed
    // FIXED parseArray function
    const parseArray = (data) => {
      if (!data || data === "") return [];

      console.log("Parsing array data:", data, "Type:", typeof data);

      // If it's already an array, return it
      if (Array.isArray(data)) {
        console.log("Data is already array:", data);
        return data;
      }

      // If it's a string
      if (typeof data === "string") {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(data);
          console.log("Successfully parsed JSON:", parsed);
          return parsed;
        } catch (jsonError) {
          console.log(
            "JSON parse failed, trying different formats:",
            jsonError.message
          );

          // Try multiple delimiters
          if (data.includes(",")) {
            // Comma-separated: "Running,Sports,Comfort"
            return data
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item);
          } else if (data.includes(" ")) {
            // Space-separated: "Running Sports Comfort"
            return data
              .split(" ")
              .map((item) => item.trim())
              .filter((item) => item);
          } else {
            // Single item
            return [data.trim()];
          }
        }
      }

      console.log("Data is neither array nor string, returning empty array");
      return [];
    };

    const parseColors = (colorsData) => {
      if (Array.isArray(colorsData)) {
        return colorsData.map((color) => {
          if (typeof color === "string") {
            return { name: color, value: color.toLowerCase() };
          }
          return color;
        });
      }
      return [];
    };

    let mainImageUrl = "";
    let imageUrls = [];

    // Handle image uploads to Cloudinary
    if (req.files && req.files.length > 0) {
      console.log("Uploading images to Cloudinary...");

      const uploads = req.files.map((file, index) =>
        cloudinary.uploader.upload(file.path, {
          folder: "ecommerce/products",
          public_id: `${name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}-${index}`,
        })
      );

      try {
        const results = await Promise.all(uploads);
        imageUrls = results.map((img) => img.secure_url);

        // First image is main image
        if (imageUrls.length > 0) {
          mainImageUrl = imageUrls[0];
        }

        console.log(`Successfully uploaded ${imageUrls.length} images`);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading images to Cloudinary",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Create product object
    const productData = {
      name,
      description,
      shortDescription: shortDescription || description.substring(0, 200),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      discount: discount ? parseInt(discount) : 0,
      category,
      subcategory,
      brand,
      mainImage: mainImageUrl,
      images: imageUrls,
      colors: parseColors(colors),
      sizes: parseArray(sizes),
      tags: parseArray(tags),
      features: parseArray(features),
      specs: specs
        ? typeof specs === "string"
          ? JSON.parse(specs)
          : specs
        : {},
      stock: parseInt(stock),
      inStock: parseInt(stock) > 0,
      isFeatured: isFeatured === "true" || isFeatured === true,
      status: status || "active",
      rating: 0,
      reviewCount: 0,
    };

    console.log("Creating product with data:", productData);

    // Create product in database
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

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
        message: "Duplicate field value entered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    console.log("Getting products with query:", req.query);

    // Build query object
    const queryObj = { ...req.query };

    // Remove special fields from queryObj
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "minPrice",
      "maxPrice",
    ];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Search by name or description
    if (req.query.search) {
      query = query.find({
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { tags: { $regex: req.query.search, $options: "i" } },
        ],
      });
    }

    // Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
      query = query.find({ price: priceFilter });
    }

    // Status filtering (only show active products to public)
    if (!req.user || req.user.role !== "admin") {
      query = query.find({ status: "active" });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); // Default: newest first
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      // Default fields to return (exclude some internal fields)
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;

    // Get total count for pagination info
    const total = await Product.countDocuments(JSON.parse(queryStr));

    // Apply search count if search was used
    let searchCount = total;
    if (req.query.search) {
      searchCount = await Product.countDocuments({
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { tags: { $regex: req.query.search, $options: "i" } },
        ],
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      total: searchCount,
      pagination: {
        page,
        limit,
        pages: Math.ceil(searchCount / limit),
        next: skip + limit < searchCount ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
      data: products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      status: "active",
    })
      .limit(8)
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get Featured Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only show active products to non-admins
    if (!req.user || req.user.role !== "admin") {
      if (product.status !== "active") {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = Product.find({
      category: category,
      status: "active",
    });

    // Apply pagination
    const total = await Product.countDocuments({
      category: category,
      status: "active",
    });

    const products = await query.skip(skip).limit(limit).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        next: skip + limit < total ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
      data: products,
    });
  } catch (error) {
    console.error("Get Products By Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
      status: "active",
    })
      .limit(20)
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export {
  createProduct,
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
};
