import Order from "../models/Order.js";
import { v4 as uuidv4 } from "uuid"; 

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingInfo, paymentMethods, items } = req.body;

    if (!shippingInfo || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Shipping info and cart items are required",
      });
    }

    // Calculate subtotal and totalAmount
    const subtotal = items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );

    const shippingFee = 0; // you can compute this dynamically
    const tax = 0; // compute if needed
    const totalAmount = subtotal + shippingFee + tax;

    // Map items to schema format
    const formattedItems = items.map((item) => ({
      productId: item.productId, // required
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      Subtotal: (item.price || 0) * (item.quantity || 1),
    }));

    // Create order in DB
    const order = await Order.create({
      orderNumber: uuidv4(), // generate unique order number
      userId,
      items: formattedItems,
      shippingAddress: shippingInfo, // matches schema
      subtotal,
      tax,
      shippingFee,
      totalAmount,
      status: paymentMethods === "cod" ? "CREATED" : "PAYMENT_PENDING",
      paymentStatus: paymentMethods === "cod" ? "UNPAID" : "UNPAID",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
