const express = require("express");
const router = express.Router();
const FileService = require("../services/file.service");

router.get("/count/:fileName", async (req, res) => {
  let fileName = req.params.fileName;
  console.log(fileName);

  // get no of file names starting with fileName
  res.status(200).json(FileService.countNoOfFiles(fileName));
});

module.exports = router;
