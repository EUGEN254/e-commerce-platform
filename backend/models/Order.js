import mongoose from "mongoose"


const orderSchema = new mongoose.Schema({
  // public order number (safe to show user)
  orderNumber:{
    type:String,
    required:true,
    unique:true,
    index:true
  },

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true
  },

  items:[
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
      },
      name:String,
      price:Number,
      quantity:Number,
      Subtotal:Number,
    }
  ],

  // amounts are computed in backend only
  subtotal:{
    type:Number,
    required:true,
  },

  tax:{
    type:Number,
    default:0,
  },

  shippingFee:{
    type:Number,
    default:0
  },

  totalAmount:{
    type:Number,
    required:true,
  },

  currency:{
    type:String,
    default:"KES"
  },
  
  status: {
      type: String,
      enum: [
        "CREATED",
        "PAYMENT_PENDING",
        "PAID",
        "FULFILLED",
        "CANCELLED",
        "EXPIRED",
      ],
      default: "CREATED",
      index: true,
    },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PARTIAL", "PAID", "REFUNDED"],
      default: "UNPAID",
    },

    // Reference to successful transaction
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },

    expiresAt: Date, // for unpaid orders
  },
  { timestamps: true }
);



export default mongoose.model("Order", orderSchema);