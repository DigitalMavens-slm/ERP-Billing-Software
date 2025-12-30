const mongoose = require("mongoose");
const Payment = require("../Model/PaymentModel");
const Invoice = require("../Model/InvoiceModel/InvoiceCreateModel");
const Purchase=require("../Model/PurchaseModel")
const  CustomerLedger = require("../Model/LedgerModel");
const SupplierLedger=require("../Model/SupplierLedgerModel")




exports.addPayment = async (req, res) => {
  try {
    const { invoiceId, purchaseId, customerId, supplierId, amount, mode, txnId, remarks } = req.body;



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
      companyId:req.companyId,
      invoiceId: invoiceObjId,
      purchaseId: purchaseObjId,
      customerId: customerObjId,
      supplierId: supplierObjId,
      amount,
      mode,
      txnId,
      remarks,
    });


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

   
    let LedgerModel;
    let query = {};
    let particulars = "";
    let debit = 0;
    let credit = 0;

   
    if (customerObjId) {
      LedgerModel = CustomerLedger;
      // query = { customerId: customerObjId };
      query = { customerId: customerObjId, companyId: req.companyId };

      credit = Number(amount); 
      particulars = `Payment Received (${mode})`;
    }


    if (supplierObjId) {
      LedgerModel = SupplierLedger;
      // query = { supplierId: supplierObjId };
      query = { supplierId: supplierObjId, companyId: req.companyId };

      debit = Number(amount); 
      particulars = `Payment Paid (${mode})`;
    }

    const lastLedger = await LedgerModel.findOne(query).sort({ createdAt: -1 }).lean();
    const prevBalance = lastLedger ? lastLedger.balance : 0;
    // const newBalance = prevBalance + (debit - credit);
    // let newBalance=prevBalance

//     if (customerObjId) newBalance = prevBalance - credit;
// if (supplierObjId) newBalance = prevBalance + debit;
let newBalance = prevBalance;

if (customerObjId) newBalance = prevBalance - credit;   
if (supplierObjId) newBalance = prevBalance - debit;   


if (!LedgerModel) {
  return res.status(400).json({
    success: false,
    message: "Invalid ledger type (customer/supplier missing)"
  });
}

    await LedgerModel.create({
      customerId: customerObjId,
      supplierId: supplierObjId,
      invoiceId: invoiceObjId,
      purchaseId: purchaseObjId,
      companyId:req.companyId,
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

