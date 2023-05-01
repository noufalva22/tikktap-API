import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    productId: { type: String, required: true },
    emailId: { type: String, required: true },
    price: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalOrderValue: { type: Number, required: true },
    status: { type: String, default: "pending" },
    paymentId: { type: String },
    productTitle: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);