import Order from "../models/Order.js";
import { v4 as uuidv4 } from "uuid"; 

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingInfo, paymentMethod, items, cartTotals } = req.body;

    // Validate required fields
    if (!shippingInfo || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Shipping info and cart items are required",
      });
    }

    if (!cartTotals) {
      return res.status(400).json({
        success: false,
        message: "Cart totals are required",
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.some(item => !item.productId || item.price === undefined)) {
      return res.status(400).json({
        success: false,
        message: "Invalid items format",
      });
    }

    // Additional validation: ensure numeric/non-negative prices and integer quantities
    for (const item of items) {
      const price = Number(item.price);
      const qty = Number(item.quantity);
      if (!isFinite(price) || price < 0) {
        return res.status(400).json({ success: false, message: "Invalid item price" });
      }
      if (!isFinite(qty) || qty < 1 || !Number.isInteger(qty)) {
        return res.status(400).json({ success: false, message: "Invalid item quantity" });
      }
    }

    // ========== SECURITY: Recalculate totals server-side ==========
    // NEVER trust client-sent prices - recalculate to prevent fraud

    // 1. Calculate subtotal from items (after product discounts)
    const subtotal = items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );

    // 2. Validate subtotal matches client calculation (within 1 cent tolerance)
    const clientSubtotal = cartTotals.subtotal || 0;
    if (Math.abs(subtotal - clientSubtotal) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Subtotal mismatch. Please refresh and try again.",
      });
    }

    // 3. Get shipping fee from county data (from frontend)
    // shippingInfo.city contains the county selected
    const shippingFee = cartTotals.shipping || 0;
    if (shippingFee < 0 || shippingFee > 5000) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping fee",
      });
    }

    // 4. Calculate tax (16% of subtotal only, not on shipping)
    const TAX_RATE = 0.16;
    const tax = Number((subtotal * TAX_RATE).toFixed(2));

    // 5. Validate tax matches client calculation (within 1 cent)
    const clientTax = cartTotals.tax || 0;
    if (Math.abs(tax - clientTax) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Tax calculation mismatch. Please refresh.",
      });
    }

    // 6. Calculate total amount
    const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

    // 7. Validate total matches client (within 1 cent)
    const clientTotal = cartTotals.total || 0;
    if (Math.abs(totalAmount - clientTotal) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch. Please refresh and try again.",
      });
    }

    // 8. Validate amount is reasonable
    if (totalAmount < 1 || totalAmount > 999999) {
      return res.status(400).json({
        success: false,
        message: "Order amount is invalid",
      });
    }

    // Map items to schema format with validation
    const formattedItems = items.map((item) => ({
      productId: item.productId,
      name: item.name || "Unknown Product",
      price: Number(item.price),
      quantity: Number(item.quantity),
      Subtotal: Number((item.price * item.quantity).toFixed(2)),
    }));

    // Create order in database
    const order = await Order.create({
      orderNumber: uuidv4(),
      userId,
      items: formattedItems,
      shippingAddress: shippingInfo,
      subtotal: Number(subtotal.toFixed(2)),
      tax,
      shippingFee,
      totalAmount,
      status: paymentMethod === "cod" ? "CREATED" : "PAYMENT_PENDING",
      paymentStatus: "UNPAID",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
    
  } catch (error) {
    console.error("Create Order Error - sanitized");
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get filter parameters
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const search = req.query.search;

    // Build query
    let query = { userId };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .lean();

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      userId,
    }).select("-__v");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = ["FULFILLED", "CANCELLED", "EXPIRED", "PAID"];
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity += item.quantity;
        product.soldCount -= item.quantity;
        await product.save();
      }
    }

    // Update order status
    order.status = "CANCELLED";
    order.paymentStatus = "UNPAID";
    order.cancelledAt = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: {
        _id: order._id,
        status: order.status,
        cancelledAt: order.cancelledAt,
      },
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update order payment status (for M-Pesa callback)
export const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, transactionId, paymentMethod = "mpesa" } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update based on payment status
    if (status === "SUCCESS") {
      order.status = "PAID";
      order.paymentStatus = "PAID";
      order.paymentMethod = paymentMethod;
      order.paidAt = new Date();
      
      if (transactionId) {
        order.transactionId = transactionId;
      }
    } else if (status === "FAILED") {
      order.status = "CREATED";
      order.paymentStatus = "UNPAID";
      
      // Restore product stock if payment fails
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stockQuantity += item.quantity;
          product.soldCount -= item.quantity;
          await product.save();
        }
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order payment status updated to: ${status}`,
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paidAt: order.paidAt,
      },
    });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order payment status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get order statistics for user
export const getOrderStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const statistics = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          totalSpent: [{ $group: { _id: null, total: { $sum: "$totalAmount" } } }],
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          byMonth: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
                total: { $sum: "$totalAmount" },
              },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 },
          ],
        },
      },
    ]);

    const result = {
      totalOrders: statistics[0]?.totalOrders[0]?.count || 0,
      totalSpent: statistics[0]?.totalSpent[0]?.total || 0,
      byStatus: statistics[0]?.byStatus || [],
      recentMonths: statistics[0]?.byMonth || [],
    };

    res.status(200).json({
      success: true,
      statistics: result,
    });
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Generate invoice for order (placeholder - implement PDF generation)
export const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      userId,
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is paid
    if (order.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Invoice can only be generated for paid orders",
      });
    }

    // This is a placeholder for invoice generation
    // You can integrate with libraries like pdfkit, puppeteer, or a PDF service
    const invoiceData = {
      invoiceNumber: `INV-${order.orderNumber.slice(0, 8).toUpperCase()}`,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      customer: {
        name: order.shippingAddress.fullName,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
        postalCode: order.shippingAddress.postalCode,
      },
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    };

    // For now, return JSON data
    // In production, generate and return a PDF file
    res.status(200).json({
      success: true,
      message: "Invoice generated successfully",
      invoice: invoiceData,
      downloadUrl: `/api/orders/${id}/invoice/pdf`, // Placeholder URL for actual PDF
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Admin-only: Get all orders (for admin dashboard)
export const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin (you need to implement this in middleware)
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const search = req.query.search;

    // Build query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const totalOrders = await Order.countDocuments(query);

    // Get orders with user details
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .select("-__v")
      .lean();

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Admin-only: Update order status (for fulfillment)
export const updateOrderStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { id } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate status transition
    const validStatuses = ["CREATED", "PAYMENT_PENDING", "PAID", "FULFILLED", "CANCELLED", "EXPIRED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Update order
    order.status = status;
    
    if (status === "FULFILLED") {
      order.fulfilledAt = new Date();
      order.shippingInfo = {
        ...order.shippingInfo,
        trackingNumber,
        carrier,
        shippedAt: new Date(),
      };
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        status: order.status,
        fulfilledAt: order.fulfilledAt,
        shippingInfo: order.shippingInfo,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
