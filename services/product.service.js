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
  // normalize text
  // normalize text
  const keys = Object.keys(obj);
   for (let key of keys) 
  {
    if(typeof obj[key] == "string")
    {
      obj[key]=normalizeNewlines(obj[key])
    }
  }
  obj = await collection.insertOne(obj);
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
function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n");
}

module.exports = ProductService = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
