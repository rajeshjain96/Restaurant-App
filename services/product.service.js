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
  for (let key of keys) {
    if (typeof obj[key] == "string") {
      obj[key] = normalizeNewlines(obj[key]);
    }
  }
  obj = await collection.insertOne(obj);
  return obj;
}
async function addManyProducts(products) {
  const db = app.locals.db;
  const collection = db.collection("products");

  const result = await collection.insertMany(products);
  const insertedIds = Object.values(result.insertedIds);
  const insertedDocs = await collection
    .find({ _id: { $in: insertedIds } })
    .toArray();
  return insertedDocs;
}
async function updateManyProducts(products) {
  const db = app.locals.db;
  const collection = db.collection("products");
  // Prepare bulk operations
  const operations = products.map((product) => {
    const { _id, ...fieldsToUpdate } = product;
    return {
      updateOne: {
        filter: { _id: ObjectId.createFromHexString(_id) },
        update: { $set: fieldsToUpdate },
      },
    };
  });
  const result = await collection.bulkWrite(operations);
  const updatedIds = products.map((p) => ObjectId.createFromHexString(p._id));

  const updatedProducts = await collection
    .find({ _id: { $in: updatedIds } })
    .toArray();
  return updatedProducts;
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
  return obj;
}

module.exports = ProductService = {
  getAllProducts,
  getProductById,
  addProduct,
  addManyProducts,
  updateManyProducts,
  updateProduct,
  deleteProduct,
};
