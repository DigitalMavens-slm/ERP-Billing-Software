const express = require("express");
const router = express.Router();
const Invoice = require("../Model/InvoiceModel/InvoiceCreateModel");
const Purchase=require("../Model/PurchaseModel")
const auth=require("../Middlewares/auth")
// const comapnyCheck=require("../Middlewares/companyCheck");
const companyCheck = require("../Middlewares/companyCheck");
const getFinancialYear=require("../Utills/getFinancialYear")
const CompanySettings = require("../Model/CompanysettingModel")
// ✅ Fetch next invoice number
// router.get("/invoices/get/next-invoice-num", auth,comapnyCheck, async (req, res) => {
//   // console.log(req.companyId)
//   try {
//     const lastInvoice = await Invoice.findOne({companyId:req.companyId}, {}, { sort: { createdAt: -1 } });
//     let nextNum = 1;

//     if (lastInvoice && lastInvoice.invoiceNum) {
//       const lastNum = parseInt(lastInvoice.invoiceNum.replace("INV", "")) || 0;
//       nextNum = lastNum + 1;
//     }

//     const nextInvoiceNum = `INV${String(nextNum).padStart(4, "0")}`;
//     res.json({ nextInvoiceNum });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error generating invoice number" });
//   }
// });



// router.get("/invoices/get/next-invoice-num", auth,async (req, res) => {

//    try {
//     const fy = getFinancialYear();

//     let settings = await CompanySettings.findById({
//        req.companyId,
//     });

//     //  console.log("getinv year",fy)
//     console.log(settings)
//     // 🟢 If company settings NOT FOUND → default
//     if (!settings) {
//       return res.json({
//         nextInvoiceNum: "INV0001",
//       });
//     }

//     // 🔥 Financial year changed → reset
//     if (settings.financialYear !== fy) {
//       settings.financialYear = fy;
//       settings.lastInvoiceNumber = 0;
//       await settings.save();
//     }


//     let nextNumber =
//       settings.lastInvoiceNumber === 0
//         ? settings.invoiceStartNumber
//         : settings.lastInvoiceNumber + 1;

//     const nextInvoiceNum = `${settings.invoicePrefix}${String(nextNumber).padStart(4, "0")}`;
// console.log(nextInvoiceNum)
//     res.json({ nextInvoiceNum });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get invoice number" });
//   }
 
// });



router.get("/invoices/get/next-invoice-num", auth, async (req, res) => {
  console.log("companyId:",req.companyId)
  try {
    const fy = getFinancialYear();

    // ✅ MUST: use findById
    const settings = await CompanySettings.findById(req.companyId);

    console.log("COMPANY SETTINGS:", settings);

    // company not created yet
    if (!settings) {
      return res.json({ nextInvoiceNum: "INV0001" });
    }

    // FY change → reset
    if (settings.financialYear !== fy) {
      settings.financialYear = fy;
      settings.lastInvoiceNumber = 0;
      await settings.save();
    }

    const nextNumber =
      settings.lastInvoiceNumber === 0
        ? settings.invoiceStartNumber
        : settings.lastInvoiceNumber + 1;

    const nextInvoiceNum =
      settings.invoicePrefix + String(nextNumber).padStart(4, "0");

    // console.log("NEXT INVOICE:", nextInvoiceNum);

    res.json({ nextInvoiceNum });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get invoice number" });
  }
});




router.get("/buy/billnum",auth,companyCheck, async (req, res) => {
  try {
    const fy=getFinancialYear()
    const lastPurchase = await Purchase.findOne({
      companyId:req.companyId,
       financialYear: fy,
    }).sort({ createdAt: -1 });
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

    res.json({ nextBillNum,financialYear: fy });
  } catch (err) {
    console.error("Error generating next bill number:", err);
    res.status(500).json({ message: "Error fetching bill number" });
  }
});



module.exports = router;
