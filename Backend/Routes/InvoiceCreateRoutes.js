const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  searchInvoice,
  updateInvoice,
  getInvoiceById,
  deleteInvoice,
  getDeletedInvoices


} = require("../Controller/InvoiceController/InvoiceCreateController");

const router = express.Router();

const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");
const financialYearMiddleware = require("../Middlewares/financialYear");

router.post("/invoices", auth, companyCheck, createInvoice);
router.delete("/invoice/delete/:id",auth,companyCheck, deleteInvoice);
// router.put("/invoices/:id",auth,companyCheck,updateInvoice);
router.get("/allinvoice", auth,companyCheck, getAllInvoices);
router.get("/invoices/:id",auth,companyCheck,getInvoiceById)


// router.route("/invoices").get(getAllInvoices);
// router.route("/invoices/search").get(searchInvoice);
router.get("/deleview", auth,financialYearMiddleware, getDeletedInvoices);

router.get("/inv/searchquery",auth,companyCheck,searchInvoice)
// router.route("/:id/payment").patch(updatePayment);


module.exports = router;
