const mongoose = require("mongoose");
const Invoice = require("../../Model/InvoiceModel/InvoiceCreateModel");
const Ledger = require("../../Model/LedgerModel");
const Inventory=require("../../Model/InventoryModel")
const APIFeatures = require("../../Utills/Apifeatures");

// ✅ Get all invoices with search/filter/pagination
const getAllInvoices = async (req, res, next) => {
  try {
    const resPerPage = 10;

    const apiFeatures = new APIFeatures(
      Invoice.find({ companyId: req.companyId }), // ✅ Filter by company here
      req.query
    )
      .search()
      .filter()
      .paginate(resPerPage);

    const invoices = await apiFeatures.query;

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchInvoice = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    if (!query) return res.status(400).json({ message: "Query required" });

    const invoices = await Invoice.find({
      $or: [
        { invoiceNum: { $regex: query, $options: "i" } },
        { customerName: { $regex: query, $options: "i" } },
        { customerPhone: { $regex: query, $options: "i" } },
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
    const invoiceData = {
      ...req.body,
      companyId: req.companyId,
    };
    console.log(invoiceData);
    // Ensure customerId is ObjectId
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

    // Reduce stock for each item
    // invoice.items.forEach(async (itm) => {
      
    //   const inventoryItem = await Inventory.findOne({
    //     productId: itm.productId,
    //     companyId: invoice.companyId,
    //   });

    //   if (inventoryItem) {
    //     // inventoryItem.qty -= itm.qty;
    //     inventoryItem.minQty -= itm.qty;
    //     await inventoryItem.save();
    //   } else {
    //     await Inventory.create({
    //       productId: itm.productId,
    //       companyId: invoice.companyId,
    //       // qty: 0 - itm.qty,            // negative stock allowed?
    //        totalPurchased: 0,
    //        totalSold: itm.qty,
    //        // minQty: 0 - itm.qty,
    //       });
    //   }
    // });



    invoice.items.forEach(async (itm) => {
  const inventoryItem = await Inventory.findOne({
    productId: itm.productId,
    companyId: invoice.companyId,
  });

  if (inventoryItem) {
    // Update existing inventory
    inventoryItem.minQty -= itm.qty;        // reduce stock
    inventoryItem.totalSold += itm.qty;     // add sold qty (IMPORTANT FIX)
    await inventoryItem.save();
  } else {
    // Create new inventory record
    await Inventory.create({
      productId: itm.productId,
      companyId: invoice.companyId,
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
    const invoice = await Invoice.findById(req.params.id);
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

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.json({ success: true, data: invoice, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
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
  searchInvoice,
  deleteInvoice,
};
