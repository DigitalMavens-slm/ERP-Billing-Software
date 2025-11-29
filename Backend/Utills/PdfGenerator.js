const fs = require("fs");
const PDFDocument = require("pdfkit");

async function generateInvoicePDF(invoice) {
  const filePath = `./invoice_${invoice.invoiceNum}.pdf`;
  const doc = new PDFDocument({ margin: 40 });

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.fontSize(20).text("🧾 Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice No: ${invoice.invoiceNum}`);
  doc.text(`Date: ${invoice.date}`);
  doc.text(`Customer: ${invoice.customerName}`);
  doc.text(`Bill Type: ${invoice.billType}`);
  doc.text(`GST Type: ${invoice.gstType}`);
  doc.moveDown();

  doc.fontSize(14).text("Items:", { underline: true });
  doc.moveDown(0.5);

  invoice.items.forEach((item, i) => {
    doc.text(
      `${i + 1}. ${item.product} — Qty: ${item.qty}, Rate: ₹${item.rate}, Total: ₹${(
        item.qty * item.rate
      ).toFixed(2)}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${invoice.total}`, { align: "right" });
  doc.end();

  await new Promise((resolve) => writeStream.on("finish", resolve));
  return filePath;
}

module.exports = { generateInvoicePDF };
