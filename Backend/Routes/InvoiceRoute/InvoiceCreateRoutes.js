const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,searchInvoice

} = require("../../Controller/InvoiceController/InvoiceCreateController");

const router = express.Router();

router.post("/invoices", createInvoice);
router.get("/allinvoice", getAllInvoices);
router.delete("/invoice/:id", getInvoiceById);


// router.route("/invoices").get(getAllInvoices);
// router.route("/invoices/search").get(searchInvoice);
router.get("/invoices/search",searchInvoice)
// router.route("/:id/payment").patch(updatePayment);


module.exports = router;
