const { app } = require("../init.js");
const { ObjectId } = require("mongodb");

async function getAllEnquiries() {
  const db = app.locals.db;

  const collection = db.collection("Enquiries");

  let list = await collection.find().toArray();

  return list;
}
async function getEnquiryById(id) {
  const db = app.locals.db;
  const collection = db.collection("enquiries");
  const enquiryObj = await collection.findOne({
    _id: ObjectId.createFromHexString(id),
  });
  // console.log("Found document is =>", userObj);
  return enquiryObj;
  // let obj = await Enquiry.findById(id);
  // return obj;
}
async function addEnquiry(obj) {
  const db = app.locals.db;
  const collection = db.collection("enquiries");
  obj = await collection.insertOne(obj);
  return obj;
}
async function addManyEnquiries(enquiries) {
  const db = app.locals.db;
  const collection = db.collection("enquiries");
  const result = await collection.insertMany(enquiries);
  const insertedIds = Object.values(result.insertedIds);
  const insertedDocs = await collection
    .find({ _id: { $in: insertedIds } })
    .toArray();
  return insertedDocs;
}
async function addRemark(obj, id) {
  const db = app.locals.db;
  const collection = db.collection("enquiries");
  const response = await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    {
      $push: {
        remarks: obj,
      },
    }
  );
  return response;
}
async function updateEnquiry(obj) {
  const db = app.locals.db;
  const collection = db.collection("enquiries");
  let id = obj._id;
  delete obj._id;
  obj = await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: obj }
  );
  return obj;
}
async function updateManyEnquiries(enquiries) {
  const db = app.locals.db;
  const collection = db.collection("enquiries");
  // Prepare bulk operations
  const operations = enquiries.map((enquiry) => {
    const { _id, ...fieldsToUpdate } = enquiry;
    return {
      updateOne: {
        filter: { _id: ObjectId.createFromHexString(_id) },
        update: { $set: fieldsToUpdate },
      },
    };
  });
  const result = await collection.bulkWrite(operations);
  const updatedIds = enquiries.map((p) => ObjectId.createFromHexString(p._id));

  const updatedEnquiries = await collection
    .find({ _id: { $in: updatedIds } })
    .toArray();
  return updatedEnquiries;
}
async function deleteEnquiry(id) {
  const db = app.locals.db;
  const collection = db.collection("enquiries");
  let obj = await collection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
  return obj;
}
module.exports = EnquiryService = {
  getAllEnquiries,
  getEnquiryById,
  addEnquiry,
  addManyEnquiries,
  updateEnquiry,
  updateManyEnquiries,
  deleteEnquiry,
  addRemark,
};
