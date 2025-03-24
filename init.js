const express = require("express");
const { MongoClient } = require("mongodb");
// const mongodb = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "mobicodb";

let db;
const app = express();

connectToDatabase();
async function connectToDatabase() {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/restaurantdb");
    await client.connect();
    db = client.db(dbName);
    app.locals.db = db;
    const collection = db.collection("customers");
    // console.log(collection);
    console.log("Database connected...");
    app.listen(3000, () => {
      console.log("Server started at port number 3000.. .");
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {app };
