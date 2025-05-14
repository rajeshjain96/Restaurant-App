const { app } = require("../init.js");
const { ObjectId } = require("mongodb");

async function getAllUsers() {
  const db = app.locals.db;

  const collection = db.collection("users");

  let list = await collection.find().toArray();

  return list;
}
async function getUserById(id) {
  let obj = await User.findById(id);
  return obj;
}
async function addUser(obj) {
  const db = app.locals.db;
  const collection = db.collection("users");
  let response = await collection.insertOne(obj);
  return obj;
}
async function updateUser(obj) {
  const db = app.locals.db;
  const collection = db.collection("users");
  let id = obj._id;
  delete obj._id;
  obj = await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: obj }
  );
  return obj;
}
async function deleteUser(id) {
  const db = app.locals.db;
  const collection = db.collection("users");
  let obj = await collection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
  console.log("Deleted");
  return obj;
}
module.exports = UserService = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
