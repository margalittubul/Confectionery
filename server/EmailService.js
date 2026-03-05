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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #f7b5cd; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">מתוק מהבית</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; direction: rtl; text-align: right;">
                    <h2 style="color: #333333; margin-top: 0;">שלום,</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                      סטטוס ההזמנה שלך עודכן!
                    </p>
                    <table width="100%" cellpadding="10" style="margin: 20px 0; border: 1px solid #eeeeee; border-radius: 4px;">
                      <tr>
                        <td style="color: #999999; font-size: 14px;">מספר הזמנה:</td>
                        <td style="color: #333333; font-weight: bold;">${orderData.orderId.toString().slice(-6)}</td>
                      </tr>
                      <tr style="background-color: #f9f9f9;">
                        <td style="color: #999999; font-size: 14px;">סטטוס חדש:</td>
                        <td style="color: #f7b5cd; font-weight: bold; font-size: 16px;">${orderData.status}</td>
                      </tr>
                      <tr>
                        <td style="color: #999999; font-size: 14px;">תאריך הזמנה:</td>
                        <td style="color: #333333;">${new Date(orderData.orderDate).toLocaleDateString("he-IL")}</td>
                      </tr>
                      <tr style="background-color: #f9f9f9;">
                        <td style="color: #999999; font-size: 14px;">סכום:</td>
                        <td style="color: #333333; font-weight: bold;">₪${orderData.price}</td>
                      </tr>
                    </table>
                    <p style="color: #666666; font-size: 14px; margin-top: 30px;">
                      תודה שבחרת בנו! 🍰
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      מתוק מהבית | ${process.env.EMAIL_USER}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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
