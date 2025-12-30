const mongoose = require("mongoose");
const Invoice = require("../../Model/InvoiceModel/InvoiceCreateModel");
const Ledger = require("../../Model/LedgerModel");
const Inventory=require("../../Model/InventoryModel")
const APIFeatures = require("../../Utills/Apifeatures");
const getFinancialYear=require("../../Utills/getFinancialYear")
const CustomerLedger=require("../../Model/LedgerModel")
const CompanySettings=require("../../Model/CompanysettingModel")
// const getFinancialYear=require("..")

const getAllInvoices = async (req, res) => {
  try {
    const resPerPage = 10;
    const currentPage = Number(req.query.page) || 1;

 
    const totalInvoices = await Invoice.countDocuments({
      companyId: req.companyId,
      financialYear:req.financialYear,
      isDeleted: false,
    }).populate("items.product", "name hsncode unit")

    const apiFeatures = new APIFeatures(
      Invoice.find({ companyId: req.companyId ,financialYear:req.financialYear,isDeleted: false}),
      req.query
    )
      .search()
      .filter()
      .paginate(resPerPage);

    const invoices = await apiFeatures.query;

    res.status(200).json({
      success: true,
      invoices,
      totalInvoices,   // ✅ NOW CORRECT
      resPerPage,
      currentPage,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



const searchInvoice = async (req, res) => {
  try {
    // console.log(req.companyId)
    const query = req.query.query?.trim();
    console.log(query);
    
    if (!query) return res.status(400).json({ message: "Query required" });
    
    const invoices = await Invoice.find({
      companyId: req.companyId,
      $or: [
        { invoiceNum: { $regex: query, $options: "i" } },
        { customerName: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ message: "No invoice found" });
    }

    res.status(200).json({ success: true, invoices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createInvoice = async (req, res) => {
  try {
    
  //                               invnum handler start
     const fy = getFinancialYear();

    // const settings = await CompanySettings.findOne({
    //   companyId: req.companyId,
    // });
    
    const settings = await CompanySettings.findById(req.companyId);


    let invoiceNum = "INV0001";

    if (settings) {
      // Financial year reset
      if (settings.financialYear !== fy) {
        settings.financialYear = fy;
        settings.lastInvoiceNumber = 0;
      }

      let nextNumber =
        settings.lastInvoiceNumber === 0
          ? settings.invoiceStartNumber
          : settings.lastInvoiceNumber + 1;

      invoiceNum = `${settings.invoicePrefix}${String(nextNumber).padStart(4, "0")}`;

      settings.lastInvoiceNumber = nextNumber;
      await settings.save();
    }


// console.log("controller invoiceNum",invoiceNum)
    const invoiceData = {
      ...req.body,
      invoiceNum,
      companyId: req.companyId,
      financialYear:fy
    };
    // console.log(invoiceData);
    if (invoiceData.customerId) {
      invoiceData.customerId = new mongoose.Types.ObjectId(
        invoiceData.customerId
      );
    }

    const newInvoice = new Invoice(invoiceData);
   const invoice= await newInvoice.save();


       if (!invoice.items || !Array.isArray(invoice.items)) {
      return res.status(400).json({ error: "Invoice items missing" });
    }
// console.log(invoice)
    
    invoice.items.forEach(async (itm) => {
  const inventoryItem = await Inventory.findOne({
    productId: itm.productId,
    companyId: invoice.companyId,
  });

  if (inventoryItem) {
    // Update existing inventory
    inventoryItem.minQty -= itm.qty;        // reduce stock
    inventoryItem.totalSold += itm.qty;     // add sold qty (IMPORTANT FIX)
    inventoryItem.financialYear = invoice.financialYear;
    await inventoryItem.save();
  } else {
    // Create new inventory record
    await Inventory.create({
      productId: itm.productId,
      companyId: invoice.companyId,
      // financialYear:invoice.financialYear,
      totalPurchased: 0,
      totalSold: itm.qty,   // first time sold qty
    });
  }
});



    // --- Create ledger entry for this invoice ---
    // Get last ledger entry for this customer to compute running balance
    const lastLedger = await Ledger.findOne({
      customerId: newInvoice.customerId,
      companyId: req.companyId,
    })
      .sort({ createdAt: -1 })
      .lean();
    const prevBalance = lastLedger ? lastLedger.balance : 0;

    const debit = Number(newInvoice.subtotal || 0);
    const credit = 0;
    const newBalance = prevBalance + debit - credit;

    await Ledger.create({
      companyId: req.companyId,
      customerId: newInvoice.customerId,
      financialYear:invoice.financialYear,
      date: newInvoice.createdAt || new Date(),
      particulars: "Invoice Generated",
      invoiceNo: newInvoice.invoiceNum,
      debit,
      credit,
      balance: newBalance,
    });

    res.status(201).json({
      success: true,
      message: "Invoice saved successfully",
      data: newInvoice,
    });
  } catch (error) {
    console.error("❌ Error saving invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save invoice",
      error: error.message,
    });
  }
}; 

// 🔹 Get Single Invoice
const getInvoiceById = async (req, res) => {
  try {
    console.log("getmethod",req.params.id)
    const invoice = await Invoice.findById(req.params.id)
    .populate("customerId") 
    .populate("items.productId", "name hsncode unit");
    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};


// const deleteInvoice = async (req, res) => {

//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     console.log("deleted",req.params.id)
//     const invoiceId = req.params.id;

//     // 1️⃣ Find invoice
//     const invoice = await Invoice.findOne({
//       _id: invoiceId,
//       companyId: req.companyId,
//     }).session(session);

//     if (!invoice) {
//       return res.status(404).json({
//         success: false,
//         message: "Invoice not found",
//       });
//     }

//     // 2️⃣ Reverse inventory (add stock back)
//     for (const item of invoice.items) {
//       const inv = await Inventory.findOne({
//         productId: item.productId,
//         companyId: invoice.companyId,
//       }).session(session);

//       if (inv) {
//         inv.qty += item.qty;              // 🔁 reverse sold qty
//         inv.minQty += item.qty;
//         inv.totalSold -= item.qty;

//         if (inv.totalSold < 0) inv.totalSold = 0;
//         await inv.save({ session });
//       }
//     }

//     // 3️⃣ Reverse customer ledger
//     const ledger = await CustomerLedger.findOne({
//       invoiceId: invoice._id,
//       companyId: invoice.companyId,
//     }).session(session);

//     if (ledger) {
//       const last = await CustomerLedger.findOne({
//         customerId: invoice.customerId,
//         companyId: invoice.companyId,
//       })
//         .sort({ createdAt: -1 })
//         .session(session);

//       if (last) {
//         last.balance -= ledger.debit; // 🔁 reverse invoice amount
//         await last.save({ session });
//       }

//       await ledger.deleteOne({ session });
//     }

//     // 4️⃣ Delete invoice
//     await Invoice.deleteOne({ _id: invoiceId }).session(session);

//     await session.commitTransaction();

//     res.json({
//       success: true,
//       message: "Invoice deleted successfully",
//       deletedInvoice: invoice,
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete invoice",
//       error: error.message,
//     });
//   }
// };



const deleteInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoiceId = req.params.id;

    // 1️⃣ Find invoice (not already deleted)
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      companyId: req.companyId,
      isDeleted: false,
    }).session(session);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // 2️⃣ Reverse inventory
    for (const item of invoice.items) {
      const inv = await Inventory.findOne({
        productId: item.productId,
        companyId: invoice.companyId,
      }).session(session);

      if (inv) {
        inv.qty += item.qty;
        inv.minQty += item.qty;
        inv.totalSold -= item.qty;
        if (inv.totalSold < 0) inv.totalSold = 0;
        await inv.save({ session });
      }
    }

    // 3️⃣ Reverse ledger (delete invoice ledger)
    await CustomerLedger.deleteMany({
      invoiceId: invoice._id,
      companyId: invoice.companyId,
    }).session(session);

    // 4️⃣ SOFT DELETE (IMPORTANT PART)
    invoice.isDeleted = true;
    invoice.deletedAt = new Date();
    await invoice.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Invoice moved to deleted list",
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
                                     
                     
// deleted invoice        dont remove this controller

const getDeletedInvoices = async (req, res) => {
  try {
    const resPerPage = 10;
    const currentPage = Number(req.query.page) || 1;
      const companyObjectId = new mongoose.Types.ObjectId(req.companyId);

    
    const baseFilter = {
      companyId: companyObjectId, 
      financialYear: req.financialYear,
      isDeleted: true,
    };

    const totalDeletedInvoices = await Invoice.countDocuments(baseFilter);

    const invoices = await Invoice.find(baseFilter)
      .sort({ deletedAt: -1 })
      .skip(resPerPage * (currentPage - 1))
      .limit(resPerPage);

    res.status(200).json({
      success: true,
      invoices,
      totalDeletedInvoices,
      resPerPage,
      currentPage,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



const fs = require("fs");
const { generateInvoicePDF } = require("../../Utills/PdfGenerator");
const { sendMailWithAttachment } = require("../../MailSender/MailSender");

async function sendInvoice(req, res) {
  try {
    const { customerEmail, invoice } = req.body;

    if (!customerEmail || !invoice) {
      return res.status(400).json({ error: "Missing email or invoice data" });
    }

    // 🧾 Generate PDF
    const pdfPath = await generateInvoicePDF(invoice);

    // ✉️ Send Mail with attachment
    await sendMailWithAttachment(
      customerEmail,
      `Invoice ${invoice.invoiceNum}`,
      `Dear ${invoice.customerName},\n\nPlease find attached your invoice.\n\nThank you for your business.`,
      pdfPath
    );

    // 🧹 Delete after sending
    fs.unlinkSync(pdfPath);

    res.json({ success: true, message: "Invoice sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending invoice:", err);
    res.status(500).json({ error: "Failed to send invoice" });
  }
}

// module.exports = { sendInvoice };
module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,     
  sendInvoice,
  // updateInvoice,
  getDeletedInvoices,
  searchInvoice,
  deleteInvoice,
};
