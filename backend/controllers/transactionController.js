import Transaction from "../models/Transaction.js";
import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import { stkPush } from "../utils/mpesa.js";
import logger from "../utils/logger.js";

/**
 * Generate a unique reference for transactions
 */
const generateReference = () => crypto.randomBytes(12).toString("hex");

export const initiateMpesaPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;
    const idempotencyKey = (req.headers["idempotency-key"] || req.body.idempotencyKey || "").toString();
    const userId = req.user._id;

    logger.info("Initiating M-Pesa payment", { orderId, userId });

    // Idempotency: if client provided a key and a transaction exists, return it
    if (idempotencyKey) {
      const existingByKey = await Transaction.findOne({ idempotencyKey, userId });
      if (existingByKey) {
        return res.status(200).json({ success: true, transaction: existingByKey, message: 'Idempotent transaction returned' });
      }
    }

    // validate orderId format early to avoid Mongoose CastError
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      logger.warn("Invalid orderId format", { orderId });
      return res.status(400).json({ success: false, message: "Invalid orderId" });
    }

    // validate order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only allow payment for CREATED or PAYMENT_PENDING orders
    if (!["CREATED", "PAYMENT_PENDING"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "This order cannot be paid" });
    }

    // Security: Verify user owns this order
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

      // Validate `orderId` format to avoid Mongoose CastError

    // Prevent duplicate pending transactions for same order
    const existingTX = await Transaction.findOne({ orderId, status: { $in: ["PENDING", "PROCESSING"] } });
    if (existingTX) {
      return res.status(400).json({ success: false, message: "Payment already initiated. Check your phone to complete." });
    }

    // create a new transaction
    const transaction = await Transaction.create({
      reference: generateReference(),
      orderId,
      userId,
      phoneNumber,
      amount: Number(order.totalAmount),
      provider: "MPESA",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "PENDING",
      idempotencyKey: idempotencyKey || undefined,
    });

    // update order status to payment_pending
    if (order.status === "CREATED") {
      order.status = "PAYMENT_PENDING";
      await order.save();
    }

    // validate and normalize phone number before calling gateway
    if (!phoneNumber || String(phoneNumber).trim().length < 9) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    let formattedPhone = phoneNumber.startsWith("0")
      ? `254${phoneNumber.slice(1)}`
      : phoneNumber.startsWith("+254")
      ? phoneNumber.slice(1)
      : phoneNumber;

    if (!/^254\d{9}$/.test(formattedPhone)) {
      return res.status(400).json({ success: false, message: "Invalid Kenyan phone number format" });
    }

    // initiate stk push
    const stkResponse = await stkPush({ phoneNumber: formattedPhone, amount: Math.round(order.totalAmount), orderId: order._id.toString() });

    // save stk identifiers in transaction
    transaction.checkoutRequestID = stkResponse.CheckoutRequestID;
    transaction.merchantRequestID = stkResponse.MerchantRequestID;
    transaction.gatewayResponse = stkResponse;
    transaction.phoneNumber = formattedPhone;
    await transaction.save();

    logger.info("STK Push initiated", { checkoutRequestID: transaction.checkoutRequestID });

    res.status(200).json({ success: true, message: "Transaction created successfully. Proceed to M-Pesa payment.", transaction, stkResponse });
  } catch (error) {
    const msg = (error && error.message) || String(error);
    // Known validation errors from mpesa utils
    if (/invalid phone number/i.test(msg) || /kenyan phone/i.test(msg) || /invalid amount/i.test(msg)) {
      logger.warn("Payment initiation validation failed", { message: msg });
      return res.status(400).json({ success: false, message: msg });
    }

    logger.error("initiateMpesaPayment error", error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// callback
export const mpesaCallback = async (req, res) => {
  try {
    const body = req.body;

    if (!body || !body.Body || !body.Body.stkCallback) {
      logger.warn("Invalid M-Pesa callback structure");
      return res.status(400).json({ ResultCode: 1, ResultDesc: "Invalid callback" });
    }

    const stkCallback = body.Body.stkCallback;
    const { CheckoutRequestID, MerchantRequestID, ResultCode, ResultDesc } = stkCallback;


    // Acknowledge receipt quickly
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    // Find the transaction using CheckoutRequestID
    const transaction = await Transaction.findOne({ checkoutRequestID: CheckoutRequestID });
    if (!transaction) {
      logger.warn("Transaction not found for callback", { CheckoutRequestID });
      return;
    }

    if (transaction.callbackReceived) {
      logger.info("Callback already processed", { transactionId: transaction._id });
      return;
    }

    const items = (stkCallback.CallbackMetadata && (stkCallback.CallbackMetadata.Item || stkCallback.CallbackMetadata)) || [];
    const amountItem = Array.isArray(items) && items.find((i) => i.Name === "Amount");
    const receiptItem = Array.isArray(items) && items.find((i) => i.Name === "MpesaReceiptNumber");
    const paidAmount = amountItem ? Number(amountItem.Value) : null;

    if (paidAmount === null) {
      logger.warn("Callback missing amount", { transactionId: transaction._id });
      // mark callback received to avoid replay but flag for manual review
      transaction.callbackReceived = true;
      transaction.status = "FAILED";
      await transaction.save();
      return;
    }

    // Confirm the paid amount matches expected value within allowed tolerance
    if (Math.abs(paidAmount - Number(transaction.amount)) > 0.01) {
      transaction.status = "FAILED";
      transaction.callbackReceived = true;
      await transaction.save();
      logger.warn("Paid amount does not match transaction amount", { transactionId: transaction._id, paidAmount, expected: transaction.amount });
      return;
    }

    if (ResultCode === 0) {
      transaction.status = "SUCCESS";
      transaction.amountPaid = paidAmount;
      transaction.mpesaReceiptNumber = receiptItem?.Value || "";
      transaction.callbackReceived = true;
      transaction.paidAt = new Date();
      await transaction.save();

      // Update order
      const order = await Order.findById(transaction.orderId);
      if (order) {
        order.status = "PAID";
        order.paymentStatus = "PAID";
        await order.save();
      }

      logger.info("M-Pesa payment successful", { transactionId: transaction._id });
      return;
    }

    transaction.status = "FAILED";
    transaction.failureReason = ResultDesc;
    transaction.callbackReceived = true;
    await transaction.save();
    logger.info("M-Pesa payment failed", { transactionId: transaction._id, ResultDesc });
  } catch (error) {
    logger.error("Error processing M-Pesa callback", error.message || error);
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
    logger.error("getTransactionStatus error", error.message || error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
