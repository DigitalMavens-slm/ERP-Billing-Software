const express = require("express");
const router = express.Router();
const {
  addPayment,
  // updatePayment,
  getPaymentsByInvoice,
  getAllPayments,
} = require("../Controller/PaymentController");


// 🔹 Add new payment
router.post("/payments", addPayment);


// 🔹 Update existing payment
// router.patch("/invoices/:paymentId/payment", updatePayment);

// 🔹 Get payments for one invoice
router.get("/invoice/:invoiceId", getPaymentsByInvoice);

// 🔹 Get all payments
router.get("/all", getAllPayments);

module.exports = router;
