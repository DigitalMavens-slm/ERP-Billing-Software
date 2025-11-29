import React, { useEffect } from "react";
// useEffect
import { useLocation, useNavigate } from "react-router-dom";
import { handlePrint,handleWhatsAppShare,handleDownloadPDF,handleEmailShare } from "../Utills/AllPrinter";
import Ledger from "../Ledger"
import { useSuggestions } from "../Context/SuggestionContext";
// import "./InvoiceDetail.css";
import axios from "axios"

const InvoiceDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
   const { setCustomerId } = useSuggestions();
  const invoice = state?.invoiceData;
  const customer=state?.customerDetails;
  console.log(customer.customerId)

  useEffect(() => {
    if (customer?.customerId) setCustomerId(customer.customerId);
  }, [customer]);

  if (!invoice) return <h3>No Invoice Data Found!</h3>;

  const totalAmount = invoice.items.reduce((acc, itm) => {
    const total = itm.qty * itm.rate;
    return acc + total;
  }, 0);


const sendMail = async () => {
  try {
    const response = await axios.post("http://localhost:4000/api/invoice/send", {
      customerEmail: customer.email,
      invoice: {
        invoiceNum: invoice.invoiceNum,
        date: invoice.date,
        customerName: invoice.customerName,
        billType: invoice.billType,
        gstType: invoice.gstType,
        items: invoice.items,
        subtotal: totalAmount.toFixed(2),
        
      },
    });

    if (response.data.success) {
      alert("✅ Invoice emailed successfully!");
    } else {
      alert("❌ Failed to send invoice");
    }
  } catch (error) {
    console.error("❌ Error sending mail:", error);
    alert("⚠️ Something went wrong while sending email!");
  }
};


  return (
    <div id="invoice-details">
      <h2>Invoice Details</h2>

      <div className="details-header">
        <p>
          <b>Invoice No:</b> {invoice.invoiceNum}

        </p>
        <p>
          <b>Invoice Date:</b> {invoice.date}
        </p>
        <p>
          <b>Customer Name:</b> {invoice.customerName}
                    <b>customer phone:</b> {customer.phone}
                    <b>customer  gst:</b> {customer.gst}
                    <b>customer email:</b> {customer.email}
                    <b>customer city:</b> {customer.address.city}
                    <b>customer pincode:</b> {customer.address.pincode}
                    <b>customer line1:</b> {customer.address.line1}
                    <b>customer line2:</b> {customer.address.line2}

                    {/* <b>customer city:</b> {customer.address.city} */}

        </p>
        <p>
          <b>Bill Type:</b> {invoice.billType}
        </p>
        <p>
          <b>GST Type:</b> {invoice.gstType}
        </p>
      </div>

      <table className="details-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Qty</th>
            <th>MRP</th>
            <th>Rate</th>
            <th>Dis%</th>
            <th>GST%</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((itm, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{itm.product}</td>
              <td>{itm.qty}</td>
              <td>₹{itm.mrp}</td>
              <td>₹{itm.rate}</td>
              <td>{itm.dis}%</td>
              <td>{itm.tax}%</td>
              <td>₹{(itm.qty * itm.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary-box">
        <p>
          <b>Sub Total:</b> ₹{totalAmount.toFixed(2)}
        </p>
        <p>
          <b>Payable Amount:</b> ₹{totalAmount.toFixed(2)}
        </p>
      </div>

      <button onClick={() => navigate("/invoicecreate")} className="back-btn">
        ← Back to New Invoice
      </button>

       <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => handlePrint("invoice-details")}>🖨 Print / PDF</button>
         <button onClick={() => handleDownloadPDF("invoice-details", "Invoice-" + invoice.invoiceNum)}>
          📄 Download PDF
        </button>
        {/* <button></button> */}
        {/* <button onClick={() => handleWhatsAppShare(invoiceNum, total)}>📱 WhatsApp</button> */}
        {/* <button onClick={() => handleDownloadPDF(invoiceNum, "customer@gmail.com", total)}>📧 Gmail</button> */}

       

         <button onClick={sendMail}>📧 Send Invoice to Mail</button>
       

      {/* <Ledger customerId={customer.customerId}/> */}
      {customer?.customerId && <Ledger customerId={customer.customerId} />}

      </div>
    </div>
  );
};

export default InvoiceDetails;
