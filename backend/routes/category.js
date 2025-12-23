import express from "express";
import {
  getAllCategories,
  getCategoryById,
  getCategoriesByType,
  getMainCategories,
  getFeaturedCategories,
  getProductsByCategoryAndSubcategory,
} from "../controllers/categoriesController.js";

const categoryRoutes = express.Router();

// Public routes
categoryRoutes.get("/", getAllCategories);
categoryRoutes.get(
  "/category/:category/subcategory/:subcategory",
  getProductsByCategoryAndSubcategory
);
categoryRoutes.get("/main", getMainCategories);
categoryRoutes.get("/featured", getFeaturedCategories);
categoryRoutes.get("/type/:type", getCategoriesByType);
categoryRoutes.get("/:id", getCategoryById);
// // Admin routes
// categoryRoutes.post("/", protect, authorize("admin"), createCategory);
// categoryRoutes.put("/:id", protect, authorize("admin"), updateCategory);
// categoryRoutes.delete("/:id", protect, authorize("admin"), deleteCategory);

export default categoryRoutes;