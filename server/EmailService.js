import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOrderStatusEmail = async (customerEmail, orderData) => {
  console.log("EmailService: Preparing to send email to", customerEmail);

  const msg = {
    to: customerEmail,
    from: process.env.EMAIL_USER,
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

  try {
    const result = await sgMail.send(msg);
    console.log("EmailService: Email sent successfully");
    return result;
  } catch (error) {
    console.error("EmailService: Failed to send email", error.response?.body || error);
    throw error;
  }
};
