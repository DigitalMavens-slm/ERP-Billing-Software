const mongoose = require("mongoose");
const PurchasePayment = require("../Model/PurchasePaymentModel");
const Purchase = require("../Model/PurchaseModel");
const Ledger = require("../Model/LedgerModel");

// ✅ Add new purchase payment (Money going OUT)
exports.addPurchasePayment = async (req, res) => {
  try {
    const { purchaseId, supplierId, amount, mode, txnId, remarks } = req.body;

    if (!purchaseId || !supplierId) {
      return res.status(400).json({ success: false, message: "purchaseId and supplierId are required" });
    }

    // Convert to ObjectId
    const purchaseObjId = new mongoose.Types.ObjectId(purchaseId);
    const supplierObjId = new mongoose.Types.ObjectId(supplierId);

    // 1️⃣ Create payment entry
    const newPayment = await PurchasePayment.create({
      purchaseId: purchaseObjId,
      supplierId: supplierObjId,
      amount,
      mode,
      txnId,
      remarks,
    });

    // 2️⃣ Update purchase payment status
    const purchase = await Purchase.findById(purchaseObjId);
    if (purchase) {
      purchase.totalPaid = (purchase.totalPaid || 0) + Number(amount);
      const totalAmount = purchase.totalAmount || purchase.subtotal || 0;

      if (purchase.totalPaid >= totalAmount) purchase.paymentStatus = "Paid";
      else if (purchase.totalPaid > 0) purchase.paymentStatus = "Partially Paid";
      else purchase.paymentStatus = "Pending";

      await purchase.save();
    }

    // 3️⃣ Ledger update (money OUT → Debit)
    const lastLedger = await Ledger.findOne({ supplierId: supplierObjId })
      .sort({ createdAt: -1 })
      .lean();

    const prevBalance = lastLedger ? lastLedger.balance : 0;
    const debit = Number(amount); // money out
    const credit = 0;
    const newBalance = prevBalance + (debit - credit);

    await Ledger.create({
      supplierId: supplierObjId,
      purchaseId: purchaseObjId,
      date: new Date(),
      particulars: `Payment Made (${mode || "NA"})`,
      debit,
      credit,
      balance: newBalance,
      type: "Purchase",
    });

    res.status(201).json({
      success: true,
      message: "✅ Purchase payment saved and ledger updated successfully",
      data: newPayment,
    });
  } catch (err) {
    console.error("💥 addPurchasePayment error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save purchase payment",
      error: err.message,
    });
  }
};

// // 🔹 Get payments for one purchase
// exports.getPaymentsByPurchase = async (req, res) => {
//   try {
//     const { purchaseId } = req.params;
//     const payments = await PurchasePayment.find({ purchaseId })
//       .populate("supplierId", "supplierName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, payments });
//   } catch (error) {
//     console.error("💥 getPaymentsByPurchase error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// 🔥 Get all payments for a supplier
exports.getPaymentsBySupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;

    const payments = await PurchasePayment.find({ supplierId })
      .populate("purchaseId")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// 🔹 Get all purchase payments
exports.getAllPurchasePayments = async (req, res) => {
  try {
    const payments = await PurchasePayment.find()
      .populate("purchaseId", "billNum supplierName date subtotal")
      .populate("supplierId", "supplierName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("💥 getAllPurchasePayments error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
