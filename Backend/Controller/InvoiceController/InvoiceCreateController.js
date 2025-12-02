const mongoose=require("mongoose")
const Invoice = require("../../Model/InvoiceModel/InvoiceCreateModel");
const Ledger=require("../../Model/LedgerModel")
const Inventory=require("../../Model/InventoryModel")
const APIFeatures = require("../../Utills/Apifeatures");

// ✅ Get all invoices with search/filter/pagination
const getAllInvoices = async (req, res, next) => {
  try {
    const resPerPage = 10;
    const apiFeatures = new APIFeatures(Invoice.find(), req.query)
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
    const invoiceData = req.body;
    const productId=req.body
   const companyId=req.companyId
   console.log("companyId",companyId)
      console.log("productId",productId)

    // Ensure customerId is ObjectId
    if (invoiceData.customerId) {
      invoiceData.customerId = new mongoose.Types.ObjectId(invoiceData.customerId);
    }

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();


     Inventory.findone({})
   

    // --- Create ledger entry for this invoice ---
    // Get last ledger entry for this customer to compute running balance
    const lastLedger = await Ledger.findOne({ customerId: newInvoice.customerId }).sort({ createdAt: -1 }).lean();
    const prevBalance = lastLedger ? lastLedger.balance : 0;

    const debit = Number(newInvoice.subtotal || 0);
    const credit = 0;
    const newBalance = prevBalance + debit - credit;

    await Ledger.create({
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
      return res.status(404).json({ success: false, message: "Invoice not found" });

    res.json({ success: true, data: invoice });
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
module.exports = { createInvoice, getAllInvoices, getInvoiceById , sendInvoice , searchInvoice};
