import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  cancelOrder,
  createOrder,
  generateInvoice,
  getOrderById,
  getOrderStatistics,
  getUserOrders,
  updateOrderPaymentStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", userAuth, createOrder);

// User routes
orderRouter.post("/", userAuth, createOrder);
orderRouter.get("/my-orders", userAuth, getUserOrders);
orderRouter.get("/:id", userAuth, getOrderById);
orderRouter.put("/:id/cancel", userAuth, cancelOrder);
orderRouter.get("/:id/invoice", userAuth, generateInvoice);
orderRouter.get("/stats/overview", userAuth, getOrderStatistics);

// M-Pesa callback (no auth needed for callback)
orderRouter.put("/:orderId/payment-status", updateOrderPaymentStatus);

// // Admin routes
// orderRouter.get("/", userAuth, adminAuth, getAllOrders);
// orderRouter.put("/:id/status", userAuth, adminAuth, updateOrderStatus);

export default orderRouter;
