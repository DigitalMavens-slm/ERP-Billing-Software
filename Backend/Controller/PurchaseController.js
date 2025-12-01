const mongoose = require("mongoose");
const Purchase = require("../Model/PurchaseModel");
const Ledger = require("../Model/LedgerModel");
const SupplierLedger=require("../Model/SupplierLedgerModel")
const APIFeatures = require("../Utills/Apifeatures");
const fs = require("fs");
const { generatePurchasePDF } = require("../Utills/PdfGenerator");
const { sendMailWithAttachment } = require("../MailSender/MailSender");
const user = require("../Model/userModel");

// ✅ Get all purchases
const getAllPurchases = async (req, res) => {
  try {
    const resPerPage = 10;

    const apiFeatures = new APIFeatures(
      Purchase.find({ companyId: req.companyId }), 
      req.query
    )
      .search()
      .filter()
      .paginate(resPerPage);

    const purchases = await apiFeatures.query;

    res.status(200).json({
      success: true,
      count: purchases.length,
      purchases,
    });
  } catch (err) {
    console.error("❌ Error fetching purchases:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const searchPurchase = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    // console.log(query)
    if (!query) return res.status(400).json({ message: "Query required" });

    const purchases = await Purchase.find({
      $or: [
        { billNum: { $regex: query, $options: "i" } },       // ✅ matches schema
        { supplierName: { $regex: query, $options: "i" } },  // ✅ matches schema
      ],
    }).limit(10);

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: "No purchase found" });
    }

    res.status(200).json({ success: true, purchases });
  } catch (err) {
    console.error("❌ Error searching purchases:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message,stack:err.stack });
  }
};




// ✅ Create purchase
const createPurchase = async (req, res) => {
  try {
    const purchaseData = req.body;

    purchaseData.companyId = req.companyId;


    if (purchaseData.supplierId) {
      purchaseData.supplierId = new mongoose.Types.ObjectId(purchaseData.supplierId);
    }

    const newPurchase = new Purchase(purchaseData);
    await newPurchase.save();


// after saving purchase
const inventoryItem = await Inventory.findOne({
  productId: purchase.productId,
  companyId: purchase.companyId
});

if (inventoryItem) {
  // already inventory irukku → qty add pannunga
  inventoryItem.qty += purchase.qty;
  await inventoryItem.save();
} else {
  // first time product varudhu → new inventory row create pannunga
  await Inventory.create({
    productId: purchase.productId,
    qty: purchase.qty,
    minQty: purchase.minQty || 0,
    companyId: purchase.companyId,
  });
}



    // Add ledger entry
const lastLedger = await SupplierLedger.findOne({ supplierId: newPurchase.supplierId })
  .sort({ createdAt: -1 })
  .lean();

const prevBalance = lastLedger ? lastLedger.balance : 0;
const credit = Number(newPurchase.subtotal || 0);
const newBalance = prevBalance + credit;

await SupplierLedger.create({
  supplierId: newPurchase.supplierId,
  date: new Date(),
  particulars: "Purchase Generated",
  purchaseNo: newPurchase.purchaseNum,
  debit: 0,
  credit,
  balance: newBalance,
});


    res.status(201).json({
      success: true,
      message: "Purchase saved successfully",
      data: newPurchase,
    });
  } catch (error) {
    console.error("❌ Error saving purchase:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save purchase",
      error: error.message,
    });
  }
};

// ✅ Get purchase by ID
const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching purchase",
      error: error.message,
    });
  }
};


const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.json({
      success: true,
      message: "Purchase deleted successfully",
      deletedPurchase: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete purchase",
      error: error.message,
    });
  }
};


// ✅ Send purchase PDF/email
const sendPurchase = async (req, res) => {
  try {
    const { supplierEmail, purchase } = req.body;

    if (!supplierEmail || !purchase) {
      return res.status(400).json({ error: "Missing email or purchase data" });
    }

    const pdfPath = await generatePurchasePDF(purchase);

    await sendMailWithAttachment(
      supplierEmail,
      `Purchase ${purchase.purchaseNum}`,
      `Dear ${purchase.supplierName},\n\nPlease find attached your purchase order.\n\nThank you.`,
      pdfPath
    );

    fs.unlinkSync(pdfPath);

    res.json({ success: true, message: "Purchase sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending purchase:", err);
    res.status(500).json({ error: "Failed to send purchase" });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    res.json({
      success: true,
      message: "Updated successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  searchPurchase,
  sendPurchase,
  deletePurchase,
  updatePurchase,
};
