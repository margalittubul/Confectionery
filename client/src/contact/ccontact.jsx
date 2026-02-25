import "./StyleContact.css";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "שם חייב להכיל לפחות 2 תווים";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "אימייל לא תקין";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "הודעה חייבת להכיל לפחות 10 תווים";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const subject = `הודעה מ-${formData.name}`;
    const body = `שם: ${formData.name}\nאימייל: ${formData.email}\n\nהודעה:\n${formData.message}`;
    
    window.location.href = `mailto:m0534102962@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="contact-page">
        <h1>צור קשר</h1>
        <p>
          נשמח לשמוע מכם! שלחו לנו הודעה או צרו קשר דרך אחד מהאופציות הבאות.
        </p>

        <div className="contact-methods">
          <p className="contact-item"> טלפון📞: 0534102962</p>
          <p className="contact-item"> m0534102962@gmail.com :📧 אימייל</p>
        </div>

        <div className="contact-form">
          <h2>שלחו לנו הודעה</h2>
          <br />
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder="שם מלא" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
            <br />
            <input 
              type="email" 
              name="email"
              placeholder="אימייל" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
            <br />
            <textarea 
              name="message"
              placeholder="הודעה" 
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            {errors.message && <p className="error-message">{errors.message}</p>}
            <br />
            <button type="submit">שלח הודעה</button>
          </form>
        </div>
      </div>
    </>
  );
}
