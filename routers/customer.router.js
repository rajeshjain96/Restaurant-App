const express = require("express");
const router = express.Router();
const CustomerService = require("../services/customer.service");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
router.get("/", async (req, res) => {
  let list = await CustomerService.getAllCustomers();
  res.status(200).json(list);
});
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(CustomerService.getCustomerById(id));
});
router.post("/", upload.single("file"), async (req, res) => {
  let obj = req.body;
  obj.addDate = new Date();
  obj.updateDate = new Date();
  obj = await CustomerService.addCustomer(obj);
  res.status(201).json(obj);
});
router.put("/", upload.single("file"), async (req, res) => {
  let obj = req.body;
  obj.updateDate = new Date();
  obj = await CustomerService.updateCustomer(obj);
  res.status(200).json(obj);
});
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let obj = req.body;
  obj = await CustomerService.deleteCustomer(id);
  res.json(obj);
});

module.exports = router;
