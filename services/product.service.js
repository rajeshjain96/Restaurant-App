const { app } = require("../init.js");
const { ObjectId } = require("mongodb");

async function getAllProducts() {
  const db = app.locals.db;

  const collection = db.collection("products");

  let list = await collection.find().toArray();

  return list;
}
async function getProductById(id) {
  let obj = await Product.findById(id);
  return obj;
}
async function addProduct(obj) {
  const db = app.locals.db;
  const collection = db.collection("products");
  let response = await collection.insertOne(obj);
  return obj;
}
async function updateProduct(obj) {
  const db = app.locals.db;
  const collection = db.collection("products");
  let id = obj._id;
  delete obj._id;
  obj = await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: obj }
  );
  return obj;
}
async function deleteProduct(id) {
  const db = app.locals.db;
  const collection = db.collection("products");
  let obj = await collection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
  console.log("Deleted");
  return obj;
}
module.exports = ProductService = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
