import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
      title: { type: String, required: true, unique: true },
      desc: { type: String, required: true, },
      category: { type: String },
      image: { type: String, required: true },
      imageSmall: { type: String, required: true },
      MRP: { type: String },
      price: { type: Number, required: true },
      inStock:{type:Boolean, default: true}
      
    },
    { timestamps: true }
  );
  
export default mongoose.model("Product", ProductSchema);