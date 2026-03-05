import nodemailer from "nodemailer";
import dns from "dns";

// להעדיף IPv4
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // להכריח שימוש ב-IPv4
  tls: {
    family: 4,
  },

  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

export const sendOrderStatusEmail = async (customerEmail, orderData) => {
  try {
    console.log("Preparing email to:", customerEmail);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `עדכון סטטוס הזמנה #${orderData.orderId}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>שלום,</h2>
          <p>סטטוס ההזמנה שלך עודכן.</p>

          <p><strong>מספר הזמנה:</strong> ${orderData.orderId}</p>
          <p><strong>סטטוס חדש:</strong> ${orderData.status}</p>
          <p><strong>תאריך הזמנה:</strong> ${new Date(orderData.orderDate).toLocaleDateString("he-IL")}</p>
          <p><strong>סכום:</strong> ₪${orderData.price}</p>

          <br/>
          <p>תודה שקנית אצלנו!</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent:", result.messageId);
    return result;

  } catch (error) {
    console.error("Failed to send email:", error);
  }
};