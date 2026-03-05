import nodemailer from "nodemailer";
import dns from "dns";

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  family: 4,
});

export const sendOrderStatusEmail = async (customerEmail, orderData) => {
  console.log("EmailService: Preparing to send email to", customerEmail);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `עדכון סטטוס הזמנה #${orderData.orderId}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>שלום,</h2>
        <p>סטטוס ההזמנה שלך עודכן!</p>
        <p><strong>מספר הזמנה:</strong> ${orderData.orderId}</p>
        <p><strong>סטטוס חדש:</strong> ${orderData.status}</p>
        <p><strong>תאריך הזמנה:</strong> ${new Date(orderData.orderDate).toLocaleDateString("he-IL")}</p>
        <p><strong>סכום:</strong> ₪${orderData.price}</p>
        <br>
        <p>תודה שבחרת בנו!</p>
      </div>
    `,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log("EmailService: Email sent successfully", result.messageId);
  return result;
};
