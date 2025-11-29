const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendMailWithAttachment(to, subject, text, attachmentPath) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: attachmentPath.split("/").pop(),
        path: attachmentPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
  console.log("📨 Mail sent successfully to:", to);
}

module.exports = { sendMailWithAttachment };
