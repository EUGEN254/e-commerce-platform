import express from "express";
import {
  getActiveOffers,
  getLimitedOffer,
  getLimitedOffers,
  getOffersStats,
  incrementClicks,
} from "../controllers/limitedOffersController.js";
// import { protect, authorize } from "../middleware/authMiddleware.js";
// import upload from "../middleware/upload.js";

const limitedOfferRouter = express.Router();

// Public routes
limitedOfferRouter.get("/", getLimitedOffers);
limitedOfferRouter.get("/active", getActiveOffers);
limitedOfferRouter.get("/stats", getOffersStats);
limitedOfferRouter.get("/:id", getLimitedOffer);
limitedOfferRouter.put("/:id/click", incrementClicks);

// Protected/Admin routes
// limitedOfferRouter.post(
//   "/",
//   protect,
//   authorize("admin"),
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "images", maxCount: 5 },
//   ]),
//   createLimitedOffer
// );

// limitedOfferRouter.put(
//   "/:id",
//   protect,
//   authorize("admin"),
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "images", maxCount: 5 },
//   ]),
//   updateLimitedOffer
// );

// limitedOfferRouter.delete("/:id", protect, authorize("admin"), deleteLimitedOffer);

export default limitedOfferRouter;
