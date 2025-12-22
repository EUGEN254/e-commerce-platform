import mongoose from "mongoose";

const limitedOfferSchema = new mongoose.Schema(
  {
    // Offer Information
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Offer description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    
    // Product Reference (if offer is for specific product)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },
    
    // Discount Configuration
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "buy_x_get_y", "free_shipping"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },
    
    // Buy X Get Y Details (if applicable)
    buyQuantity: {
      type: Number,
      min: [1, "Buy quantity must be at least 1"],
    },
    getQuantity: {
      type: Number,
      min: [0, "Get quantity cannot be negative"],
    },
    
    // Price Configuration
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Price cannot be negative"],
    },
    offerPrice: {
      type: Number,
      required: [true, "Offer price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function(value) {
          return value <= this.originalPrice;
        },
        message: "Offer price cannot be higher than original price",
      },
    },
    
    // Images
    image: {
      type: String,
      required: [true, "Offer image is required"],
    },
    images: [
      {
        type: String,
      },
    ],
    
    // Offer Validity
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function(value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    
    // Eligibility & Limits
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    perUserLimit: {
      type: Number,
      min: [1, "Per user limit must be at least 1"],
    },
    
    // Categories & Tags
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    
    // Status & Metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // Analytics
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
    
    // Timestamps - REMOVE updatedAt field since timestamps handles it
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for discount percentage
limitedOfferSchema.virtual("discountPercentage").get(function() {
  return Math.round(((this.originalPrice - this.offerPrice) / this.originalPrice) * 100);
});

// Virtual for time remaining
limitedOfferSchema.virtual("timeRemaining").get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  return Math.max(0, end - now);
});

// Virtual for days remaining
limitedOfferSchema.virtual("daysRemaining").get(function() {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil(this.timeRemaining / msPerDay);
});

// Virtual for isExpired
limitedOfferSchema.virtual("isExpired").get(function() {
  return new Date() > new Date(this.endDate);
});

// Virtual for isActiveNow (combines isActive and date check)
limitedOfferSchema.virtual("isActiveNow").get(function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= new Date(this.startDate) &&
    now <= new Date(this.endDate)
  );
});

// Indexes for performance
limitedOfferSchema.index({ isActive: 1, endDate: 1 });
limitedOfferSchema.index({ isFeatured: 1, priority: -1 });
limitedOfferSchema.index({ categories: 1 });
limitedOfferSchema.index({ tags: 1 });

// REMOVE ALL MIDDLEWARE - Mongoose timestamps will handle updatedAt automatically
// limitedOfferSchema.pre("save", function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// limitedOfferSchema.pre("findOneAndUpdate", function(next) {
//   this.set({ updatedAt: Date.now() });
//   next();
// });

const LimitedOffer = mongoose.model("LimitedOffer", limitedOfferSchema);

export default LimitedOffer;