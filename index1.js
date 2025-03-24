const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
let db;
const app = express();
var cors = require("cors");

const CategoryRouter = require("./routers/category.router.js");
const productRouter = require("./routers/product.router.js");
app.use(cors());
app.use(express.json());
app.use("/categories", CategoryRouter);
app.use("/products", productRouter);
let connectionString = `mongodb://127.0.0.1:27017/restaurantdb`;
connectToDatabase();
async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/restaurantdb");
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server started at port number 3000.. .");
    });
  } catch (err) {
    console.log(err);
  }
}
//   try {
//     mongodb.connect(
//       connectionString,
//       { useNewUrlParser: true, useUnifiedTopology: true },
//       function (err, client) {
//         db = client.db();
//         app.listen(3000, () => {
//           console.log("Server started at port number 3000.. .");
//         });
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }
// module.exports = db;
