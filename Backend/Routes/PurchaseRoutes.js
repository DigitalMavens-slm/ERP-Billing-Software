const express = require("express");
const router = express.Router();
const purchaseController = require("../Controller/PurchaseController");
const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");

// ✅ Create new purchase
router.post("/purchases", auth, companyCheck, purchaseController.createPurchase);

// ✅ Get all purchases
router.get("/purchases",auth, companyCheck ,purchaseController.getAllPurchases);


router.get(
  "/purchases/:id",
  auth,
  companyCheck,
  purchaseController.getPurchaseById
);
// ✅ Get single purchase
router.delete("/purchases/:id", auth, companyCheck, purchaseController.deletePurchase);

// ✅ Search purchase (for frontend suggestions)
router.get("/pur/searchquery", auth, companyCheck, purchaseController.searchPurchase);

// ✅ (Optional) Send purchase PDF/email
router.post("/purchases/send", purchaseController.sendPurchase);

// router.put(
//   "/purchases/:id",
//   auth,
//   companyCheck,
//   purchaseController.updatePurchase
// );


module.exports = router;

