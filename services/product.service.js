const Product = require("../models/product.model.js");

async function getAllProducts() {
  let list = await Product.find();
  console.log(list.length);
  console.log(list);
  return list;
}
async function getProductById(id) {
  let obj = await Product.findById(id);
  return obj;
}
async function addProduct(obj) {
  obj = await Product.create(obj);
  console.log("Added");
  console.log(obj);
  return obj;
}
async function updateProduct(obj) {
  obj = await Product.findByIdAndUpdate(obj._id, obj, { new: true });
  console.log("Updated");
  console.log(obj);
  return obj;
}
async function deleteCategory(id) {
  obj = await Category.findByIdAndDelete(id);
  console.log("Deleted");
  console.log(obj);
  return obj;
}
module.exports = ProductService = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteCategory,
};
