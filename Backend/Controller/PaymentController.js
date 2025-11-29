const mongoose = require("mongoose");
const Payment = require("../Model/PaymentModel");
const Invoice = require("../Model/InvoiceModel/InvoiceCreateModel");
const Purchase=require("../Model/PurchaseModel")
const  CustomerLedger = require("../Model/LedgerModel");
const SupplierLedger=require("../Model/SupplierLedgerModel")

// 🔹 Add New Payment
// exports.addPayment = async (req, res) => {
//   try {
//     const { invoiceId, customerId, amount, mode, txnId, remarks } = req.body;
//     console.log(req.body)

//     // ✅ Validate required fields
//     if (!invoiceId || !customerId) {
//       return res.status(400).json({ success: false, message: "invoiceId and customerId are required" });
//     }

//     // ✅ Convert to ObjectIds
//     const invoiceObjId = new mongoose.Types.ObjectId(invoiceId);
//     const customerObjId = new mongoose.Types.ObjectId(customerId);

//     // ✅ Create new payment
//     const newPayment = await Payment.create({
//       invoiceId: invoiceObjId,
//       customerId: customerObjId,
//       amount,
//       mode,
//       txnId,
//       remarks,
//     });

//     // ✅ Update invoice totals and status
//     const invoice = await Invoice.findById(invoiceObjId);
//     if (invoice) {
//       invoice.totalPaid = (invoice.totalPaid || 0) + Number(amount);
//       const totalAmount = invoice.totalAmount || invoice.subtotal || 0;

//       if (invoice.totalPaid >= totalAmount) invoice.paymentStatus = "Paid";
//       else if (invoice.totalPaid > 0) invoice.paymentStatus = "Partially Paid";
//       else invoice.paymentStatus = "Pending";

//       await invoice.save();
//     }

//     // ✅ Get last ledger entry for balance
//     const lastLedger = await Ledger.findOne({ customerId: customerObjId })
//       .sort({ createdAt: -1 })
//       .lean();

//     const prevBalance = lastLedger ? lastLedger.balance : 0;
//     const debit = 0;
//     const credit = Number(amount);
//     const newBalance = prevBalance + (debit - credit);

//     // ✅ Create new ledger entry
//     await Ledger.create({
//       customerId: customerObjId,
//       invoiceId: invoiceObjId,
//       invoiceNo: invoice?.invoiceNum || "-",
//       date: new Date(),
//       particulars: `Payment Received (${mode || "NA"})`,
//       debit,
//       credit,
//       balance: newBalance,
//     });

    
//     res.status(201).json({
//       success: true,
//       message: "✅ Payment saved and ledger updated successfully",
//       data: newPayment,
//     });
//   } catch (err) {
//     console.error("💥 Payment create error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to save payment",
//       error: err.message,
//     });
//   }
// };



exports.addPayment = async (req, res) => {
  try {
    const { invoiceId, purchaseId, customerId, supplierId, amount, mode, txnId, remarks } = req.body;

    console.log("REQ BODY => ", req.body);

    if (!invoiceId && !purchaseId) {
      return res.status(400).json({ success: false, message: "invoiceId or purchaseId required" });
    }

    if (!customerId && !supplierId) {
      return res.status(400).json({ success: false, message: "customerId or supplierId required" });
    }

    // Convert IDs
    const invoiceObjId = invoiceId ? new mongoose.Types.ObjectId(invoiceId) : null;
    const purchaseObjId = purchaseId ? new mongoose.Types.ObjectId(purchaseId) : null;
    const customerObjId = customerId ? new mongoose.Types.ObjectId(customerId) : null;
    const supplierObjId = supplierId ? new mongoose.Types.ObjectId(supplierId) : null;

    // Create Payment
    const newPayment = await Payment.create({
      invoiceId: invoiceObjId,
      purchaseId: purchaseObjId,
      customerId: customerObjId,
      supplierId: supplierObjId,
      amount,
      mode,
      txnId,
      remarks,
    });

    // ------------------------------------------------
    // SALES PAYMENT → UPDATE INVOICE
    // ------------------------------------------------
    if (invoiceObjId) {
      const invoice = await Invoice.findById(invoiceObjId);
      if (invoice) {
        invoice.totalPaid = (invoice.totalPaid || 0) + Number(amount);
        const totalAmount = invoice.totalAmount || invoice.subtotal || 0;

        invoice.paymentStatus =
          invoice.totalPaid >= totalAmount
            ? "Paid"
            : invoice.totalPaid > 0
            ? "Partially Paid"
            : "Pending";

        await invoice.save();
      }
    }

    // ------------------------------------------------
    // PURCHASE PAYMENT → UPDATE PURCHASE
    // ------------------------------------------------
    if (purchaseObjId) {
      const purchase = await Purchase.findById(purchaseObjId);
      if (purchase) {
        purchase.totalPaid = (purchase.totalPaid || 0) + Number(amount);
        const totalAmount = purchase.totalAmount || purchase.subtotal || 0;

        purchase.paymentStatus =
          purchase.totalPaid >= totalAmount
            ? "Paid"
            : purchase.totalPaid > 0
            ? "Partially Paid"
            : "Pending";

        await purchase.save();
      }
    }

    // ------------------------------------------------
    // 🔥 LEDGER LOGIC (MAIN PART)
    // ------------------------------------------------
    let LedgerModel;
    let query = {};
    let particulars = "";
    let debit = 0;
    let credit = 0;

    // -----------------------------
    // SALES PAYMENT → Customer Ledger
    // -----------------------------
    if (customerObjId) {
      LedgerModel = CustomerLedger;
      query = { customerId: customerObjId };

      credit = Number(amount); // money coming in
      particulars = `Payment Received (${mode})`;
    }

    // -----------------------------
    // PURCHASE PAYMENT → Supplier Ledger
    // -----------------------------
    if (supplierObjId) {
      LedgerModel = SupplierLedger;
      query = { supplierId: supplierObjId };

      debit = Number(amount); // money going out
      particulars = `Payment Paid (${mode})`;
    }

    const lastLedger = await LedgerModel.findOne(query).sort({ createdAt: -1 }).lean();
    const prevBalance = lastLedger ? lastLedger.balance : 0;
    const newBalance = prevBalance + (debit - credit);

    await LedgerModel.create({
      customerId: customerObjId,
      supplierId: supplierObjId,
      invoiceId: invoiceObjId,
      purchaseId: purchaseObjId,
      date: new Date(),
      particulars,
      debit,
      credit,
      balance: newBalance,
    });

    res.status(201).json({
      success: true,
      message: "Payment updated + correct ledger updated",
      data: newPayment,
    });
  } catch (err) {
    console.error("addPayment error:", err);
    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: err.message,
    });
  }
};


// 🔹 Update existing payment
exports.updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, mode, txnId, remarks } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    const invoice = await Invoice.findById(payment.invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    const oldAmount = payment.amount;

    payment.amount = amount ?? payment.amount;
    payment.mode = mode ?? payment.mode;
    payment.txnId = txnId ?? payment.txnId;
    payment.remarks = remarks ?? payment.remarks;

    await payment.save();

    invoice.totalPaid = (invoice.totalPaid || 0) - oldAmount + payment.amount;
    invoice.balance = (invoice.subtotal || 0) - invoice.totalPaid;
    await invoice.save();

    res.status(200).json({
      success: true,
      message: "✅ Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.error("💥 Payment update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get payments for one invoice
exports.getPaymentsByInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const payments = await Payment.find({ invoiceId })
      .populate("customerId", "name")
      .sort({ date: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("💥 getPaymentsByInvoice error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("invoiceId", "invoiceNum customerName date subtotal")
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("💥 getAllPayments error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

