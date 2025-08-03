import './css.css';
import React, { useEffect, useState } from 'react';
import {Link,useParams} from 'react-router-dom'
import {getOrderById} from '../API/OrderController.js';
import { updateOrderStatus } from '../API/OrderController.js';
import { useNavigate } from 'react-router-dom';

export default function Tashlum()
{
    const { orderId } = useParams();
    const [order, setOrder] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

   useEffect(() => {
  const fetchOrder = async () => {
    try {
      const ord = await getOrderById(orderId);
      if (!ord) throw new Error('Order not found');
      setOrder(ord);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchOrder();
}, [orderId]); 


    if (error) return <div>שגיאה: {error}</div>;


   const handleSubmit = async () => {
    try {
        console.log('מנסה לעדכן סטטוס...');
        const response = await updateOrderStatus(orderId, 'שולם');
        console.log('הסטטוס עודכן בהצלחה:', response);
        navigate(`/OkOrder/${orderId}`);
    } catch (err) {
        console.error('שגיאה במהלך עדכון הסטטוס:', err);
        alert(`שגיאה בעדכון סטטוס ההזמנה: ${err.message}`);
    }
};


    return(
        <>
            <div className="payment-container">
            <h2 className='main-title'>טופס רכישה מאובטחת</h2>

            <form className="form-grid">
                <input placeholder="שם מלא *" className='input-style' required />
                <input placeholder="דוא״ל *"className='input-style' required />
                <input placeholder="טלפון *"className='input-style' required />
                <input placeholder="כתובת *"className='input-style' required />
                <input placeholder="עיר *"className='input-style' required />
                <input placeholder="מיקוד"className='input-style' />
            </form>

            <h3 className='main-title'>פרטי אשראי</h3>

            <div className="credit-form">
                <input placeholder="מספר כרטיס אשראי *" className='input-style' required />
                <div className="credit-details">
                    <select className='select-style'>
                        <option>חודש</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i}>{i + 1}</option>
                        ))}
                    </select>
                    <select className='select-style'>
                        <option>שנה</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i}>{2025 + i}</option>
                        ))}
                    </select>
                    <input placeholder="3 ספרות בגב הכרטיס *" className='input-style'/>
                </div>
                <select className='select-style'>
                    <option>מספר תשלומים</option>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n}>{n}</option>
                    ))}
                </select>
            </div>

            <div className="total-section">
                <p>סה"כ לתשלום: ₪ {order.price}</p>
                
            </div>

           <button className="submit-btn" onClick={handleSubmit}>
            אישור
           </button>

            
            </div>
        </>
    );
}