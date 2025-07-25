const { app } = require("../init.js");
const { ObjectId } = require("mongodb");

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
  let response = await collection.insertOne(obj);
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
  return obj;
}
async function deleteCustomer(id) {
  const db = app.locals.db;
  const collection = db.collection("customers");
  let obj = await collection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
  console.log("Deleted");
  return obj;
}
module.exports = CustomerService = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
