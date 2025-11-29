const express = require("express");
const router = express.Router();
const purchaseController = require("../Controller/PurchaseController");
const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");

// ✅ Create new purchase
router.post("/purchases", auth, companyCheck, purchaseController.createPurchase);

// ✅ Get all purchases
router.get("/purchases",auth, companyCheck ,purchaseController.getAllPurchases);

// ✅ Get single purchase
// router.get("/purchases/id/:id", purchaseController.getPurchaseById);

// ✅ Search purchase (for frontend suggestions)
router.get("/purchases/search", purchaseController.searchPurchase);

// ✅ (Optional) Send purchase PDF/email
router.post("/purchases/send", purchaseController.sendPurchase);

module.exports = router;

