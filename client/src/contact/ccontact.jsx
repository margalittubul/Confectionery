import "./StyleContact.css";
export default function Contact() {
  return (
    <>
      <div className="contact-page">
        <h1>צור קשר</h1>
        <p>
          נשמח לשמוע מכם! שלחו לנו הודעה או צרו קשר דרך אחד מהאופציות הבאות.
        </p>

        <div className="contact-methods">
          <p className="contact-item"> טלפון📞: 0534102962</p>
          <p className="contact-item"> margalittubul@gmail.com :📧 אימייל</p>
        </div>

        <div className="contact-form">
          <h2>שלחו לנו הודעה</h2>
          <br />
          <form>
            <input type="text" placeholder="שם מלא" required />
            <br />
            <input type="email" placeholder="אימייל" required />
            <br />
            <textarea placeholder="הודעה" required></textarea>
            <br />
            <button type="submit">שלח הודעה</button>
          </form>
        </div>
      </div>
    </>
  );
}
