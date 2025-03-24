const express = require("express");
const { db, app } = require("./init.js");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "mobicodb";

// let db, collection;
// const app = express();
var cors = require("cors");

const categoryRouter = require("./routers/category.router.js");
const customerRouter = require("./routers/customer.router.js");
const productRouter = require("./routers/product.router.js");
app.use(cors());
app.use(express.json());
app.use("/categories", categoryRouter);
app.use("/customers", customerRouter);
app.use("/products", productRouter);
let connectionString = `mongodb://127.0.0.1:27017/restaurantdb`;
// connectToDatabase();
// async function connectToDatabase() {
//   try {
//     // await mongoose.connect("mongodb://127.0.0.1:27017/restaurantdb");
//     await client.connect();
//     db = client.db(dbName);
//     // collection = db.collection("customers");
//     console.log("Database connected");
//     app.listen(3000, () => {
//       console.log("Server started at port number 3000.. .");
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

// module.exports = db;
