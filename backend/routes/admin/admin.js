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
  getProductStats
} from "../../controllers/admin/adminProduct.js";


import {
  getDashboardStats,
  getSalesData,
  getCategoryDistribution,
  getRecentOrders,
  getRecentActivities
} from "../../controllers/admin/dashboardController.js";

const adminRouter = express.Router();

// Admin auth routes
adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter.get("/details", AdminAuth, getAdminDetails);

// Product CRUD routes
adminRouter.post("/create", 
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]), 
  AdminAuth, 
  createProduct
);

adminRouter.get("/products", AdminAuth, getAllProducts);
adminRouter.get("/products/:id", AdminAuth, getProductById);

adminRouter.put("/products/:id", 
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
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

export default adminRouter;