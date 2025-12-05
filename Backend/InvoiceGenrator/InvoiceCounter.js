const express = require("express");
const router = express.Router();
const Invoice = require("../Model/InvoiceModel/InvoiceCreateModel");
const Purchase=require("../Model/PurchaseModel")
const auth = require("../Middlewares/auth");
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


router.get("/purchases/next-bill-num", auth, async (req, res) => {
  try {
    const companyId = req.companyId;
    console.log(companyId )
    // Get last bill for THIS company
    const lastPurchase = await Purchase.findOne({ companyId }).sort({
      createdAt: -1,
    });

    let nextBillNum = "BILL0001";

    if (lastPurchase && lastPurchase.billNum) {
      const lastBill = lastPurchase.billNum;

      // safety check: billNum must start with BILL
      if (lastBill.startsWith("BILL")) {
        const numericPart = parseInt(lastBill.slice(4), 10);

        if (!isNaN(numericPart)) {
          const newNum = numericPart + 1;
          nextBillNum = `BILL${newNum.toString().padStart(4, "0")}`;
        }
      }
    }

    res.json({ nextBillNum });
  } catch (err) {
    console.error("Error generating next bill number:", err);
    res.status(500).json({ message: "Error fetching bill number" });
  }
});



module.exports = router;
