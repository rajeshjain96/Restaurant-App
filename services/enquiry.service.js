const { app } = require("../init.js");
const { ObjectId } = require("mongodb");

async function getAllEnquiries() {
  const db = app.locals.db;

  const collection = db.collection("Enquiries");

  let list = await collection.find().toArray();

  return list;
}
async function getEnquiryById(id) {
  let obj = await Enquiry.findById(id);
  return obj;
}
async function addEnquiry(obj) {
  const db = app.locals.db;
  const collection = db.collection("Enquiries");
  let response = await collection.insertOne(obj);
  return obj;
}
async function updateEnquiry(obj) {
  const db = app.locals.db;
  const collection = db.collection("Enquiries");
  let id = obj._id;
  delete obj._id;
  obj = await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: obj }
  );
  return obj;
}
async function deleteEnquiry(id) {
  const db = app.locals.db;
  const collection = db.collection("Enquiries");
  let obj = await collection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
  console.log("Deleted");
  return obj;
}
module.exports = EnquiryService = {
  getAllEnquiries,
  getEnquiryById,
  addEnquiry,
  updateEnquiry,
  deleteEnquiry,
};
