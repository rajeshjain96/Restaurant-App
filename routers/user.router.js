const express = require("express");
const router = express.Router();
const UserService = require("../services/user.service");
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
  let list = await UserService.getAllUsers();
  res.status(200).json(list);
});
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(UserService.getUserById(id));
});
router.get("/byEmailId/:emailId", async (req, res) => {
  let emailId = req.params.emailId;
  res.status(200).json(await UserService.getUserByEmailId(emailId));
});
router.post("/", upload.single("file"), async (req, res) => {
  let obj = req.body;
  obj.addDate = new Date();
  obj.updateDate = new Date();
  obj = await UserService.addUser(obj);
  res.status(201).json(obj);
});
router.post("/signup", async (req, res) => {
  let obj = req.body;
  obj = await UserService.checkUser(obj);
  res.status(201).json(obj);
});
router.post("/login", async (req, res) => {
  let obj = req.body;
  obj = await UserService.checkUserTryingToLogIn(obj);
  res.status(201).json(obj);
});
router.put("/", upload.single("file"), async (req, res) => {
  let obj = req.body;
  obj.updateDate = new Date();
  obj = await UserService.updateUser(obj);
  res.status(200).json(obj);
});
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let obj = req.body;
  obj = await UserService.deleteUser(id);
  res.json(obj);
});

module.exports = router;
