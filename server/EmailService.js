import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderStatusEmail = async (customerEmail, orderData) => {
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

  await transporter.sendMail(mailOptions);
};
