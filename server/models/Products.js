import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  barcode: { type: String, required: true },
  name: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  source: {
    type: String,
    enum: ["local_db", "api", "user_contributed"],
    default: "local_db",
  },

  date: { type: Date, default: Date.now },
});

const ProductsModel = mongoose.model("Products", productSchema);

export default ProductsModel;
