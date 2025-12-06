const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,searchInvoice

} = require("../Controller/InvoiceController/InvoiceCreateController");

const router = express.Router();

const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");

router.post("/invoices", auth, companyCheck, createInvoice);
router.get("/allinvoice", auth,companyCheck, getAllInvoices);
router.delete("/invoice/:id", getInvoiceById);


// router.route("/invoices").get(getAllInvoices);
// router.route("/invoices/search").get(searchInvoice);
router.get("/inv/searchquery",auth,companyCheck,searchInvoice)
// router.route("/:id/payment").patch(updatePayment);


module.exports = router;
