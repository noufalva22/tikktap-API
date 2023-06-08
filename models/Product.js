import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productID: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, },
    category: { type: String },
    image: [
      {
        src: {
          type: String, 
        }
      },
    ],

    imageSmall: [
      {
        src: {
          type: String, 
        }
      },
    ],  
    imageThumbnail: [
      {
        src: {
          type: String, 
        }
      },
    ],  
    MRP: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true }

  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);