const Category = require("../models/category.model.js");
const db = require("../index.js");
async function getAllCategories() {
  let list = await Category.find();

  return list;
}
async function getCategoryById(id) {
  let obj = await Category.findById(id);
  return obj;
}
async function addCategory(obj) {
  obj = await Category.create(obj);
  console.log("Added");
  console.log(obj);
  return obj;
}
async function updateCategory(obj) {
  obj = await Category.findByIdAndUpdate(obj._id, obj, { new: true });
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
module.exports = CategoryService = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
