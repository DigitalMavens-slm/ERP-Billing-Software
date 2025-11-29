const express = require("express");
const router = express.Router();
const Invoice = require("../Model/InvoiceModel/InvoiceCreateModel");
const Purchase=require("../Model/PurchaseModel")
// ✅ Fetch next invoice number
router.get("/invoices/next-invoice-num", async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne({}, {}, { sort: { createdAt: -1 } });
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


router.get("/purchases/next-bill-num", async (req, res) => {
  try {
    const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });
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
