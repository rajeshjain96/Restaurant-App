const express = require("express");
const router = express.Router();
const ProductService = require("../services/product.service");

router.get("/", async (req, res) => {
  let list = await ProductService.getAllProducts();
  console.log("check.." + list.length);

  res.status(200).json(list);
});
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(ProductService.getProductById(id));
});
router.post("/", async (req, res) => {
  let obj = req.body;
  obj = await ProductService.addProduct(obj);
  res.json(obj);
});
router.put("/", async (req, res) => {
  let obj = req.body;
  obj = await ProductService.updateProduct(obj);
  res.json(obj);
});
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let obj = req.body;
  obj = await ProductService.deleteProduct(id);
  res.json(obj);
});

module.exports = router;
