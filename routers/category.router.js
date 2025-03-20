const express = require("express");
const router = express.Router();
const CategoryService = require("../services/category.service");

router.get("/", async (req, res) => {
  let list = await CategoryService.getAllCategories();
  console.log("check.." + list.length);

  res.status(200).json(list);
});
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(CategoryService.getCategoryById(id));
});
router.post("/", async (req, res) => {
  let obj = req.body;
  obj = await CategoryService.addCategory(obj);
  res.json(obj);
});
router.put("/", async (req, res) => {
  let obj = req.body;
  obj = await CategoryService.updateCategory(obj);
  res.json(obj);
});
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let obj = req.body;
  obj = await CategoryService.deleteCategory(id);
  res.json(obj);
});

module.exports = router;
