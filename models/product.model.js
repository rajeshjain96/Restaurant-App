const mongoose = require("mongoose");
let productSchema = new mongoose.Schema(
  {
    name: String,
    price: String,
    isAvailable: Boolean,
    categoryId: String,
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
