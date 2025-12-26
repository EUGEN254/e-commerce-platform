import Transaction from "../models/Transaction.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import { stkPush } from "../utils/mpesa.js";

/**
 * Generate a unique reference for transactions
 */
const generateReference = () => crypto.randomBytes(12).toString("hex");

export const initiateMpesaPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;
    const userId = req.user._id;

    console.log(
      "Initiating M-Pesa payment for order:",
      orderId,
      "user:",
      userId
    );

    // validate order
    const order = await Order.findById(orderId);

    if (!order) {
      // stop immediately
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // only order that are created or payment pending proceed
    if (order.status !== "CREATED" && order.status !== "PAYMENT_PENDING") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be paid",
      });
    }

    // check that the order belongs to the authenticated user
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot pay for this order",
      });
    }

    // prevent multiple pending transactions
    const existingTX = await Transaction.findOne({
      orderId,
      status: "PENDING",
    });
    if (existingTX) {
      return res.status(400).json({
        success: false,
        message: "Payment already initiated check your phone to complete",
      });
    }

    console.log("Creating transaction record for order:", orderId);

    // create a new transaction
    const transaction = await Transaction.create({
      reference: generateReference(),
      orderId,
      userId,
      phoneNumber,
      amount: order.totalAmount,
      provider: "MPESA",
      ipAddress: req.ip, //available whenever the client makes a request
      userAgent: req.get("User-Agent"),
      status: "PENDING",
    });

    // update order status to payment_pending
    if (order.status === "CREATED") {
      order.status = "PAYMENT_PENDING";
      await order.save();
    }

    // initiate stk push
    const stkResponse = await stkPush({
      phoneNumber,
      amount: Math.round(order.totalAmount),
      orderId: order._id.toString(),
    });

    console.log("STK Push Response:", stkResponse);

    // save stk indentifiers intransaction
    transaction.checkoutRequestID = stkResponse.CheckoutRequestID;
    transaction.merchantRequestID = stkResponse.MerchantRequestID;
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Transaction created successfully. Proceed to M-Pesa payment.",
      transaction,
      stkResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// callback
export const mpesaCallback = async (req, res) => {
  try {
    console.log("M-Pesa callback received:", req.body);

    const callbackData = req.body.Body.stkCallback;

    // Always respond to Safaricom immediately
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const {
      CheckoutRequestID,
      MerchantRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callbackData;

    // Find the transaction using CheckoutRequestID
    const transaction = await Transaction.findOne({
      checkoutRequestID: CheckoutRequestID,
    });
    if (!transaction) {
      console.error(
        "Transaction not found for CheckoutRequestID:",
        CheckoutRequestID
      );
      return;
    }

    // Update transaction status based on ResultCode
    if (ResultCode === 0) {
      transaction.status = "SUCCESS";

      // Extract payment amount and Mpesa receipt number
      const items = CallbackMetadata.Item;
      const amountItem = items.find((i) => i.Name === "Amount");
      const mpesaReceiptItem = items.find(
        (i) => i.Name === "MpesaReceiptNumber"
      );

      transaction.amountPaid = amountItem?.Value || transaction.amount;
      transaction.mpesaReceiptNumber = mpesaReceiptItem?.Value || "";
      await transaction.save();

      // Update order status to PAID
      const order = await Order.findById(transaction.orderId);
      if (order) {
        order.status = "PAID";
        order.paymentStatus = "PAID";
        await order.save();
      }

      console.log(`Transaction ${CheckoutRequestID} completed successfully.`);
    } else {
      transaction.status = "FAILED";
      transaction.failureReason = ResultDesc;
      await transaction.save();
      console.log(`Transaction ${CheckoutRequestID} failed: ${ResultDesc}`);
    }
  } catch (error) {
    console.error("Error processing M-Pesa callback:", error);
  }
};

// Get transaction status
export const getTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
