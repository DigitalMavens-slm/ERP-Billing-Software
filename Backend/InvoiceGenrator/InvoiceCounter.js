const express = require("express");
const router = express.Router();
const Invoice = require("../Model/InvoiceModel/InvoiceCreateModel");
const Purchase=require("../Model/PurchaseModel")
const auth=require("../Middlewares/auth")
const comapnyCheck=require("../Middlewares/companyCheck");
const companyCheck = require("../Middlewares/companyCheck");
// ✅ Fetch next invoice number
router.get("/invoices/get/next-invoice-num", auth,comapnyCheck, async (req, res) => {
  // console.log(req.companyId)
  try {
    const lastInvoice = await Invoice.findOne({companyId:req.companyId}, {}, { sort: { createdAt: -1 } });
    let nextNum = 1;

    if (lastInvoice && lastInvoice.invoiceNum) {
      const lastNum = parseInt(lastInvoice.invoiceNum.replace("INV", "")) || 0;
      nextNum = lastNum + 1;
    }

    const nextInvoiceNum = `INV${String(nextNum).padStart(4, "0")}`;
    res.json({ nextInvoiceNum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating invoice number" });
  }
});



router.get("/buy/billnum",auth,companyCheck, async (req, res) => {
  try {
    const lastPurchase = await Purchase.findOne({companyId:req.companyId}).sort({ createdAt: -1 });
    let nextBillNum = "BILL0001";

    if (lastPurchase && lastPurchase.billNum) {
      const num = parseInt(lastPurchase.billNum.replace("BILL", ""), 10) + 1;
      nextBillNum = `BILL${num.toString().padStart(4, "0")}`;
    }

    res.json({ nextBillNum });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bill number" });
  }
});


module.exports = router;
