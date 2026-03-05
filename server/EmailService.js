import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOrderStatusEmail = async (customerEmail, orderData) => {
  console.log("EmailService: Preparing to send email to", customerEmail);

  const msg = {
    to: customerEmail,
    from: {
      email: process.env.EMAIL_USER,
      name: "מתוק מהבית"
    },
    replyTo: process.env.EMAIL_USER,
    subject: `עדכון הזמנה #${orderData.orderId.toString().slice(-6)}`,
    text: `שלום,\n\nסטטוס ההזמנה שלך עודכן ל: ${orderData.status}\nמספר הזמש: ${orderData.orderId.toString().slice(-6)}\nסכום: ₪${orderData.price}\n\nתודה שבחרת בנו!\nמתוק מהבית`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f7b5cd 0%, #f48fb1 100%); border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🍰 מתוק מהבית</h1>
        </div>
        
        <h2 style="color: #333; font-size: 18px;">שלום,</h2>
        <p style="color: #666; font-size: 16px;">סטטוס ההזמנה שלך עודכן!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0; color: #666;"><strong>מספר הזמנה:</strong> ${orderData.orderId.toString().slice(-6)}</p>
          <p style="margin: 8px 0; color: #f7b5cd; font-size: 18px;"><strong>סטטוס:</strong> ${orderData.status}</p>
          <p style="margin: 8px 0; color: #666;"><strong>סכום:</strong> ₪${orderData.price}</p>
        </div>
        
        <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">תודה שבחרת בנו! 💕</p>
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
