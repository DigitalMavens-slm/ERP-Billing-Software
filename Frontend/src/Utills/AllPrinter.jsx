import html2canvas from "html2canvas";
import jsPDF from "jspdf";


export const handlePrint = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return alert("Print element not found!");

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice Print</title>
        <style>
          @media print {
            body {
              font-family: 'Segoe UI', sans-serif;
              margin: 20px;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              border: 1px solid #aaa;
              padding: 8px 10px;
              text-align: left;
            }
            th {
              background: #f2f2f2;
            }
            h2 {
              text-align: center;
              color: #222;
            }
            .summary {
              margin-top: 20px;
              text-align: right;
              font-weight: bold;
            }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};



export const handleDownloadPDF = async (elementId, fileName = "document") => {
  const element = document.getElementById(elementId);
  if (!element) return alert("PDF element not found!");

  // 🧠 Ensure hidden parts visible
  const originalStyle = element.style.overflow;
  element.style.overflow = "visible";

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);

  // restore
  element.style.overflow = originalStyle;
};


/**
 * 💬 Share via WhatsApp
 */
export const handleWhatsAppShare = (message) => {
  if (!message) return alert("Message is empty!");
  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMsg}`, "_blank");
};

/**
 * ✉️ Share via Email
 */
export const handleEmailShare = (subject, body) => {
  const mailtoLink = `mailto:?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, "_blank");
};
