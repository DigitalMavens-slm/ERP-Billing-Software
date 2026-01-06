const mongoose = require("mongoose");
const Purchase = require("../Model/PurchaseModel");
const Ledger = require("../Model/LedgerModel");
const SupplierLedger=require("../Model/SupplierLedgerModel")
const APIFeatures = require("../Utills/Apifeatures");
const fs = require("fs");
const { generatePurchasePDF } = require("../Utills/PdfGenerator");
const { sendMailWithAttachment } = require("../MailSender/MailSender");
const user = require("../Model/userModel");
const Inventory=require("../Model/InventoryModel")
const getFinancialYear=require("../Utills/getFinancialYear")


const PurchaseAPIFeatures = require("../Utills/PurchaseApiFeatures");

const getAllPurchases = async (req, res) => {
  console.log(req.financialYear)
  try {
    const resPerPage = 10;

    const totalPurchases = await Purchase.countDocuments({
      companyId: req.companyId,
      financialYear: req.financialYear,
    });

    const apiFeatures = new PurchaseAPIFeatures(
      Purchase.find({ companyId: req.companyId,financialYear: req.financialYear, }),
      req.query
    )
      .search()
      .filter()
      .paginate(resPerPage);

    const purchases = await apiFeatures.query;

    res.json({
      success: true,
      purchases,
      totalPurchases,
      resPerPage,
      currentPage: Number(req.query.page) || 1,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



const searchPurchase = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    console.log(query)
    if (!query) return res.status(400).json({ message: "Query required" });

    const purchases = await Purchase.find({
      companyId: req.companyId,
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
    purchaseData.financialYear=getFinancialYear();

    if (purchaseData.supplierId) {
      purchaseData.supplierId = new mongoose.Types.ObjectId(purchaseData.supplierId);
    }

    const newPurchase = new Purchase(purchaseData);
       const purchase=  await newPurchase.save();
      //  console.log(purchase.items._id)


for (const itm of purchase.items) {
  const inventoryItem = await Inventory.findOne({
    productId: itm.productId,
    companyId: purchase.companyId,
  });

  if (inventoryItem) {
    inventoryItem.qty += itm.qty;
    inventoryItem.minQty += itm.qty;
    inventoryItem.totalPurchased += itm.qty;
    await inventoryItem.save();
  } else {
    await Inventory.create({
      productId: itm.productId,
      companyId: purchase.companyId,
      qty: itm.qty,
      minQty: itm.qty,
      totalPurchased: itm.qty,
      totalSold: 0,
    });
  }
}



    // Add ledger entry
const lastLedger = await SupplierLedger.findOne({
   supplierId: purchase.supplierId ,
   companyId:purchase.companyId

})
  .sort({ createdAt: -1 })
  .lean();

const prevBalance = lastLedger ? lastLedger.balance : 0;
const credit = Number(newPurchase.subtotal || 0);
const newBalance = prevBalance + credit;

await SupplierLedger.create({
  purchaseId:purchase._id,
  supplierId: purchase.supplierId,
  companyId: req.companyId, // 🔥 MUST ADD THIS
  date: new Date(),
  particulars: "Purchase Generated",
  purchaseNo: purchase.purchaseNum,
  debit: 0,
  credit,
  balance: newBalance,
});


    res.status(201).json({
      success: true,
      message: "Purchase saved successfully",
      data: purchase,
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




// ✅ Get purchase by ID                       Edit getPurchasecontroller
const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById({
       _id: req.params.id,
  companyId: req.companyId,

}).populate("supplierId").populate("items.product", "name hsncode unit");

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

// const updatePurchase = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const purchaseId = req.params.id;
//     const newData = req.body;

//     // 1️⃣ Fetch OLD Purchase with company filter
//     const oldPurchase = await Purchase.findOne({
//       _id: purchaseId,
//       companyId: req.companyId,
//     }).session(session);

//     if (!oldPurchase) {
//       return res.status(404).json({
//         success: false,
//         message: "Purchase not found for this company",
//       });
//     }

//     // 2️⃣ Reverse OLD INVENTORY
//     for (const item of oldPurchase.items) {
//       const inv = await Inventory.findOne({
//         productId: item.productId,
//         companyId: oldPurchase.companyId,
//       }).session(session);

//       if (inv) {
//         inv.qty -= item.qty;
//         inv.minQty -= item.qty;
//         inv.totalPurchased -= item.qty;

//         if (inv.qty < 0) inv.qty = 0;

//         await inv.save({ session });
//       }
//     }

//     // 3️⃣ Reverse OLD LEDGER ENTRY
//     const oldLedger = await SupplierLedger.findOne({
//       purchaseId: oldPurchase._id,
//       companyId: oldPurchase.companyId,
//     }).session(session);

//     if (oldLedger) {
//       // Reduce supplier balance
//       const lastBalance = await SupplierLedger.findOne({
//         supplierId: oldPurchase.supplierId,
//         companyId: oldPurchase.companyId,
//       })
//         .sort({ createdAt: -1 })
//         .session(session);

//       if (lastBalance) {
//         lastBalance.balance -= oldLedger.credit;
//         await lastBalance.save({ session });
//       }

//       await oldLedger.deleteOne({ session });
//     }

//     // 4️⃣ UPDATE Purchase with NEW values
//     const updatedPurchase = await Purchase.findByIdAndUpdate(
//       purchaseId,
//       newData,
//       { new: true, session }
//     );

//     // 5️⃣ APPLY NEW INVENTORY
//     for (const item of updatedPurchase.items) {
//       const inv = await Inventory.findOne({
//         productId: item.productId,
//         companyId: updatedPurchase.companyId,
//       }).session(session);

//       if (inv) {
//         inv.qty += item.qty;
//         inv.minQty += item.qty;
//         inv.totalPurchased += item.qty;

//         await inv.save({ session });

//       } else {
//         await Inventory.create(
//           [
//             {
//               productId: item.productId,
//               companyId: updatedPurchase.companyId,
//               qty: item.qty,
//               minQty: item.qty,
//               totalPurchased: item.qty,
//               totalSold: 0,
//             },
//           ],
//           { session }
//         );
//       }
//     }

//     // 6️⃣ ADD NEW LEDGER ENTRY
//     const latest = await SupplierLedger.findOne({
//       supplierId: updatedPurchase.supplierId,
//       companyId: updatedPurchase.companyId,
//     })
//       .sort({ createdAt: -1 })
//       .session(session);

//     const previousBalance = latest ? latest.balance : 0;
//     const newCredit = updatedPurchase.subtotal || 0;

//     await SupplierLedger.create(
//       [
//         {
//           purchaseId: updatedPurchase._id,
//           supplierId: updatedPurchase.supplierId,
//           companyId: updatedPurchase.companyId,
//           credit: newCredit,
//           debit: 0,
//           balance: previousBalance + newCredit,
//           particulars: "Purchase Updated",
//           purchaseNo: updatedPurchase.purchaseNum,
//           date: new Date(),
//         },
//       ],
//       { session }
//     );

//     // 7️⃣ FINALLY COMMIT
//     await session.commitTransaction();

//     return res.json({
//       success: true,
//       message: "Purchase updated successfully",
//       data: updatedPurchase,
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     return res.status(500).json({
//       success: false,
//       message: "Error updating purchase",
//       error: error.message,
//     });
//   }
// };




const deletePurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchaseId = req.params.id;

    const purchase = await Purchase.findOne({
      _id: purchaseId,
      companyId: req.companyId,
    }).session(session);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // 2️⃣ Reverse inventory changes
    for (const item of purchase.items) {
      const inv = await Inventory.findOne({
        productId: item.productId,
        companyId: purchase.companyId,
      }).session(session);

      if (inv) {
        inv.qty -= item.qty;              // reverse added stock
        inv.minQty -= item.qty;
        inv.totalPurchased -= item.qty;

        if (inv.qty < 0) inv.qty = 0;     // prevent negative stock
        await inv.save({ session });
      }
    }

    // 3️⃣ Reverse Ledger entry
    const ledger = await SupplierLedger.findOne({
      purchaseId: purchase._id,
      companyId: purchase.companyId,
    }).session(session);

    if (ledger) {
      // reverse ledger balance
      const last = await SupplierLedger.findOne({
        supplierId: purchase.supplierId,
        companyId: purchase.companyId,
      })
        .sort({ createdAt: -1 })
        .session(session);

      if (last) {
        last.balance -= ledger.credit; // reverse purchase amount
        await last.save({ session });
      }

      await ledger.deleteOne({ session }); // delete ledger entry
    }

    // 4️⃣ Delete purchase finally
    await Purchase.deleteOne({ _id: purchaseId }).session(session);

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Purchase deleted successfully",
      deletedPurchase: purchase,
    });

  } catch (error) {
    await session.abortTransaction();
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








module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  searchPurchase,
  sendPurchase,
  deletePurchase,
  // updatePurchase,
};
