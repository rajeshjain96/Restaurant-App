const express = require("express");
const { app } = require("./init.js");
var cors = require("cors");
const categoryRouter = require("./routers/category.router.js");
const customerRouter = require("./routers/customer.router.js");
const productRouter = require("./routers/product.router.js");
app.use(cors());
app.use(express.json());
app.use("/categories", categoryRouter );
app.use("/customers", customerRouter);
app.use("/products", productRouter);
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
