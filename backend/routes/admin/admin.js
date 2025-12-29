// backend/routes/adminRouter.js
import express from "express";
import {
  getAdminDetails,
  loginAdmin,
  logoutAdmin,
} from "../../controllers/admin/adminController.js";
import AdminAuth from "../../middleware/adminAuth.js";
import upload from "../../middleware/upload.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  toggleFeatured,
  bulkDeleteProducts,
  bulkUpdateProducts,
  getProductStats,
} from "../../controllers/admin/adminProduct.js";

import {
  getDashboardStats,
  getSalesData,
  getCategoryDistribution,
  getRecentOrders,
  getRecentActivities,
} from "../../controllers/admin/dashboardController.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../controllers/admin/adminUser.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  bulkUpdateCategories,
  bulkDeleteCategories,
  // updateCategoryOrder and autoReorderCategories removed
  getProductsCountByCategory,
  getAllCategoriesWithProducts,
  getCategoryStats,
  updateCategoryStatus,
  getProductsCountForAllCategories,
} from "../../controllers/admin/adminCategory.js";

const adminRouter = express.Router();

// Admin auth routes
adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter.get("/details", AdminAuth, getAdminDetails);

// Product CRUD routes
adminRouter.post(
  "/create",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  AdminAuth,
  createProduct
);

adminRouter.get("/products", AdminAuth, getAllProducts);
adminRouter.get("/products/:id", AdminAuth, getProductById);

adminRouter.put(
  "/products/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  AdminAuth,
  updateProduct
);

adminRouter.delete("/products/:id", AdminAuth, deleteProduct);
adminRouter.patch("/products/:id/status", AdminAuth, updateProductStatus);
adminRouter.patch("/products/:id/toggle-featured", AdminAuth, toggleFeatured);
adminRouter.post("/products/bulk-delete", AdminAuth, bulkDeleteProducts);
adminRouter.post("/products/bulk-update", AdminAuth, bulkUpdateProducts);
adminRouter.get("/products-stats", AdminAuth, getProductStats);

// Dashboard routes
adminRouter.get("/dashboard/stats", AdminAuth, getDashboardStats);
adminRouter.get("/dashboard/sales", AdminAuth, getSalesData);
adminRouter.get("/dashboard/categories", AdminAuth, getCategoryDistribution);
adminRouter.get("/dashboard/recent-orders", AdminAuth, getRecentOrders);
adminRouter.get("/dashboard/activities", AdminAuth, getRecentActivities);

// category routes
adminRouter.get("/categories", AdminAuth, getAllCategories);
adminRouter.get("/categories/:id", AdminAuth, getCategoryById);
adminRouter.post(
  "/categories",
  AdminAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 }, 
  ]),
  createCategory
);

adminRouter.put(
  "/categories/:id",
  AdminAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateCategory
);
adminRouter.delete("/categories/delete-category/:id", AdminAuth, deleteCategory);
adminRouter.patch("/categories/:id/status", AdminAuth, updateCategoryStatus);
adminRouter.patch("/categories/bulk-update", AdminAuth, bulkUpdateCategories);
adminRouter.delete("/categories/bulk-delete", AdminAuth, bulkDeleteCategories);
// Display order endpoints removed
adminRouter.get("/categories/:id/products-count", AdminAuth, getProductsCountByCategory);
adminRouter.get("/categories/with-products", AdminAuth, getAllCategoriesWithProducts);
adminRouter.get("/categories/stats", AdminAuth, getCategoryStats);
adminRouter.get("/categories/products-count/all", AdminAuth, getProductsCountForAllCategories);

// Admin user management
adminRouter.get('/users', AdminAuth, getAllUsers);
adminRouter.get('/users/:id', AdminAuth, getUserById);
adminRouter.patch('/users/:id', AdminAuth, updateUser);
adminRouter.delete('/users/:id', AdminAuth, deleteUser);

export default adminRouter;
