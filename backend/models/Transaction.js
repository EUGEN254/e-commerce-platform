import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // internal system reference (uuid or generated)
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // order of relation
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // payment gateway
    provider: {
      type: String,
      enum: ["MPESA"],
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    // amount is always from backend
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "KES",
    },

    // transaction lifecyle
    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
        "CANCELLED",
        "TIMEOUT",
      ],
      default: "PENDING",
      index: true,
    },

    // M-Pesa specific identifiers
    checkoutRequestID: String,
    merchantRequestID: String,
    mpesaReceiptNumber: String,

    // gateway raw response for audits
    // Gateway raw response (for audits)
    gatewayResponse: {
      type: Object,
    },

    // Failure reason (user cancelled, insufficient funds, timeout)
    failureReason: {
      type: String,
    },

    // Security & abuse prevention
    attempts: {
      type: Number,
      default: 0,
    },

    ipAddress: String,
    userAgent: String,

    // Callback verification
    callbackReceived: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
