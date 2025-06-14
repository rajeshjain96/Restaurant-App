const express = require("express");
const router = express.Router();
const EnquiryService = require("../services/enquiry.service");
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
router.get("/", async (req, res, next) => {
  try {
    let list = await EnquiryService.getAllEnquiries();
    res.status(200).json(list);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let obj = await EnquiryService.getEnquiryById(id);
    res.send(obj);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
router.post("/", upload.any(), async (req, res, next) => {
  try {
    let obj = req.body;
    obj.addDate = new Date();
    obj.updateDate = new Date();
    ////////// enquiries has got remakrs as sub-collection
    obj.remarks[0].addDate = new Date();
    ///////////////////
    obj = await EnquiryService.addEnquiry(obj);
    res.status(201).json(obj);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
router.post("/bulk-add", upload.any(), async (req, res, next) => {
  let enquiries = req.body;
  if (!Array.isArray(enquiries)) {
    return res.status(400).json({ message: "Invalid input, expected array" });
  }
  enquiries.forEach((e, index) => {
    e.addDate = new Date();
    e.updateDate = new Date();
  });
  try {
    let result = await EnquiryService.addManyEnquiries(enquiries);
    res.status(201).json(result);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
router.put("/", upload.any(), async (req, res, next) => {
  try {
    let obj = req.body;
    obj.updateDate = new Date();
    obj = await EnquiryService.updateEnquiry(obj);
    res.status(200).json(obj);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
router.put("/bulk-update", upload.any(), async (req, res, next) => {
  let enquiries = req.body;
  if (!Array.isArray(enquiries)) {
    return res.status(400).json({ message: "Invalid input, expected array" });
  }
  enquiries.forEach((e, index) => {
    e.updateDate = new Date();
  });
  try {
    let result = await EnquiryService.updateManyEnquiries(enquiries);
    res.status(201).json(result);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let obj = req.body;
    obj = await EnquiryService.deleteEnquiry(id);
    res.json(obj);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
/////////////sub-collection routes///////////////
router.post("/:id/remarks", async (req, res, next) => {
  try {
    const id = req.params.id;
    let obj = req.body;
    obj.addDate = new Date();
    obj = await EnquiryService.addRemark(obj, id);
    res.status(201).json(obj);
  } catch (error) {
    next(error); // Send error to middleware
  }
});
module.exports = router;
