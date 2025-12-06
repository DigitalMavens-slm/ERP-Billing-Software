const express = require("express");
const router = express.Router();
const {
  addPayment,
  getPaymentsByInvoice,
  getAllPayments,
} = require("../Controller/PaymentController");
const auth=require("../Middlewares/auth")
const companyCheck=require("../Middlewares/companyCheck")

router.post("/payments",auth,companyCheck, addPayment);

router.get("/invoice/:invoiceId",auth,companyCheck, getPaymentsByInvoice);

router.get("/all",auth,companyCheck, getAllPayments);

module.exports = router;
