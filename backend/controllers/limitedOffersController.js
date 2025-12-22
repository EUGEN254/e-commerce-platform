
import { v2 as cloudinary } from "cloudinary";
import LimitedOffer from "../models/LimitedOffer.js";


// Helper function for image upload
const uploadToCloudinary = async (file, folder = "ecommerce/limited-offers") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

// Create Limited Offer
export const createLimitedOffer = async (req, res) => {
  try {
    console.log("Creating limited offer...");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const {
      title,
      description,
      shortDescription,
      discountType,
      discountValue,
      buyQuantity,
      getQuantity,
      originalPrice,
      offerPrice,
      startDate,
      endDate,
      usageLimit,
      perUserLimit,
      categories,
      tags,
      isActive,
      isFeatured,
      priority,
      productId,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      title: "Offer title",
      description: "Offer description",
      originalPrice: "Original price",
      offerPrice: "Offer price",
      endDate: "End date",
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

    // Validate price
    if (parseFloat(offerPrice) > parseFloat(originalPrice)) {
      return res.status(400).json({
        success: false,
        message: "Offer price cannot be higher than original price",
      });
    }

    // Validate dates
    if (new Date(endDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "End date must be in the future",
      });
    }

    if (startDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    // Handle image upload
    let imageUrl = "";
    let additionalImages = [];

    if (req.files) {
      // Main image
      if (req.files.image) {
        imageUrl = await uploadToCloudinary(req.files.image[0]);
      } else if (req.files.images && req.files.images[0]) {
        // Fallback to first image if no specific 'image' field
        imageUrl = await uploadToCloudinary(req.files.images[0]);
      }

      // Additional images
      if (req.files.images) {
        for (let i = 0; i < req.files.images.length; i++) {
          // Skip first image if it was used as main image
          if (i === 0 && !req.files.image) continue;
          const url = await uploadToCloudinary(req.files.images[i]);
          additionalImages.push(url);
        }
      }
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Parse arrays
    const parseArray = (data) => {
      if (!data) return [];
      
      if (Array.isArray(data)) return data;
      
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return data.split(",").map(item => item.trim()).filter(item => item);
        }
      }
      
      return [];
    };

    // Create offer object
    const offerData = {
      title,
      description,
      shortDescription: shortDescription || description.substring(0, 200),
      discountType: discountType || "percentage",
      discountValue: parseFloat(discountValue) || 0,
      buyQuantity: buyQuantity ? parseInt(buyQuantity) : undefined,
      getQuantity: getQuantity ? parseInt(getQuantity) : undefined,
      originalPrice: parseFloat(originalPrice),
      offerPrice: parseFloat(offerPrice),
      image: imageUrl,
      images: [imageUrl, ...additionalImages],
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: new Date(endDate),
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      perUserLimit: perUserLimit ? parseInt(perUserLimit) : undefined,
      categories: parseArray(categories),
      tags: parseArray(tags),
      isActive: isActive === "true" || isActive === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      priority: priority ? parseInt(priority) : 0,
      product: productId || undefined,
    };

    // Create offer
    const limitedOffer = await LimitedOffer.create(offerData);

    res.status(201).json({
      success: true,
      message: "Limited offer created successfully",
      data: limitedOffer,
    });

  } catch (error) {
    console.error("Create Limited Offer Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
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

// Get All Limited Offers
export const getLimitedOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      active = true,
      featured,
      category,
      tag,
      search,
    } = req.query;

    // Build query
    const query = {};

    // Active offers filter
    if (active === "true") {
      query.isActive = true;
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }

    // Featured filter
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Category filter
    if (category) {
      query.categories = { $in: [category] };
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Parse sort
    const sortOptions = {};
    if (sort.startsWith("-")) {
      sortOptions[sort.substring(1)] = -1;
    } else {
      sortOptions[sort] = 1;
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const offers = await LimitedOffer.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate("product", "name price mainImage");

    const total = await LimitedOffer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: offers.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: offers,
    });

  } catch (error) {
    console.error("Get Limited Offers Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get Active Offers for Homepage
export const getActiveOffers = async (req, res) => {
  try {
    const { limit = 10, featured } = req.query;

    const query = {
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    };

    if (featured === "true") {
      query.isFeatured = true;
    }

    const offers = await LimitedOffer.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate("product", "name price mainImage category");

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });

  } catch (error) {
    console.error("Get Active Offers Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Single Limited Offer
export const getLimitedOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await LimitedOffer.findById(id)
      .populate("product", "name price description mainImage category brand");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Limited offer not found",
      });
    }

    // Increment views
    offer.views += 1;
    await offer.save();

    res.status(200).json({
      success: true,
      data: offer,
    });

  } catch (error) {
    console.error("Get Limited Offer Error:", error);
    
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid offer ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Limited Offer
export const updateLimitedOffer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find offer first
    let offer = await LimitedOffer.findById(id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Limited offer not found",
      });
    }

    // Handle image updates if new files are uploaded
    if (req.files) {
      if (req.files.image) {
        const newImageUrl = await uploadToCloudinary(req.files.image[0]);
        req.body.image = newImageUrl;
        // Add new image to images array
        req.body.images = [newImageUrl, ...offer.images.slice(0, 4)]; // Keep max 5 images
      }

      if (req.files.images) {
        const newImages = [];
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file);
          newImages.push(url);
        }
        // Combine new images with existing ones
        req.body.images = [...newImages, ...offer.images].slice(0, 5);
      }
    }

    // Update offer
    offer = await LimitedOffer.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Limited offer updated successfully",
      data: offer,
    });

  } catch (error) {
    console.error("Update Limited Offer Error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
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

// Delete Limited Offer
export const deleteLimitedOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await LimitedOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Limited offer not found",
      });
    }

    await offer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Limited offer deleted successfully",
    });

  } catch (error) {
    console.error("Delete Limited Offer Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Increment Clicks (for tracking)
export const incrementClicks = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await LimitedOffer.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Limited offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Click tracked",
      data: offer,
    });

  } catch (error) {
    console.error("Track Click Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Offers Count (for admin dashboard)
export const getOffersStats = async (req, res) => {
  try {
    const totalOffers = await LimitedOffer.countDocuments();
    const activeOffers = await LimitedOffer.countDocuments({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    const expiredOffers = await LimitedOffer.countDocuments({
      endDate: { $lt: new Date() },
    });
    const featuredOffers = await LimitedOffer.countDocuments({
      isFeatured: true,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalOffers,
        activeOffers,
        expiredOffers,
        featuredOffers,
      },
    });

  } catch (error) {
    console.error("Get Offers Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};