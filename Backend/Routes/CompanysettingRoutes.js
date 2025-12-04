const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../Controller/CompanysettingController");
const auth = require("../Middlewares/auth");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET must be protected
router.get("/company-settings", auth, controller.saveCompanySettings);

// CREATE
router.post(
  "/company-settings",
  auth,
  upload.fields([
    { name: "logoUrl", maxCount: 1 },
    { name: "paymentUrl", maxCount: 1 },
    { name: "extraPaymentUrl", maxCount: 1 },
  ]),
  controller.createCompanySettings
);

// UPDATE
router.put(
  "/company-settings/:id",
  auth,
  upload.fields([
    { name: "logoUrl", maxCount: 1 },
    { name: "paymentUrl", maxCount: 1 },
    { name: "extraPaymentUrl", maxCount: 1 },
  ]),
  controller.saveCompanySettings
);

module.exports = router;
