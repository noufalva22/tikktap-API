import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderID: { type: String,  unique: true },
    username: { type: String, required: true },
    emailId: { type: String, required: true },
    mobile: { type: Number },
    name: { type: String },
    shippingAddress: {
      fullAddress: {
        type: String,
      },
      pincode: {
        type: Number,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    status: { type: String, default: "pending" },
    products:
    {
      type: Array,
      // required: true
    }
    ,
    amount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalOrderValue: { type: Number, required: true },
    payment: {
      paymentID: {
        type: String,
        required: true ,
        
      },
      method: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

OrderSchema.pre('save', async function (next) {
  try {
    const Order = mongoose.model('Order');
    if (this.isNew) {
      const lastOrder = await Order.findOne().sort({ orderID: -1 }).exec();
      const lastOrderId = lastOrder ? parseInt(lastOrder.orderID.substring(2)) : 0;
      const nextOrderId = (lastOrderId + 1).toString().padStart(4, '0');
      this.orderID = 'TT' + nextOrderId;
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Order", OrderSchema);