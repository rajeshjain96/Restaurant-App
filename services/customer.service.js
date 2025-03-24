// const Category = require("../models/category.model.js");
// const { MongoClient } = require("mongodb");
// const { MongoClient } = require("mongodb");
const { db, app } = require("../init.js");
const collection = require("../index.js");
const { ObjectId } = require("mongodb");

// const collection = db.collection("customers");
// const collection = null; //db.collection("customers");
// console.log("Dada");

// console.log(db);

async function getAllCustomers() {
  const db = app.locals.db;

  const collection = db.collection("customers");

  let list = await collection.find().toArray();

  return list;
}
async function getCustomerById(id) {
  let obj = await Customer.findById(id);
  return obj;
}
async function addCustomer(obj) {
  const db = app.locals.db;
  const collection = db.collection("customers");
  obj = await collection.insertOne(obj);
  return obj;
}
async function updateCustomer(obj) {
  const db = app.locals.db;
  const collection = db.collection("customers");
  let id = obj._id;
  delete obj._id;
  obj = await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: obj }
  );
  console.log("Updated");
  console.log(obj);
  return obj;
}
async function deleteCustomer(id) {
  // obj = await Customer.findByIdAndDelete(id);
  const db = app.locals.db;
  const collection = db.collection("customers");
  let obj = await collection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
  console.log("Deleted");
  console.log(obj);
  return obj;
}
module.exports = CustomerService = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
