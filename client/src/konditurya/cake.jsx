import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { getProductById } from '../API/ProductsController.js';
import { useDispatch } from 'react-redux';
import { addProductToBuying } from '../Redux/cartSlice.js';

export default function Cake() {
  const [cake, setCake] = useState(null);
  const [error, setError] = useState(null);
  const { cakeId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchCake() {
      try {
        const data = await getProductById(cakeId);
        setCake(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCake();
  }, [cakeId]);

  const handleAddToCart = () => {
    if (!cake) return;
    dispatch(addProductToBuying({ productId: cake.id, quantity: 1 }))
      .unwrap()//מקבל את הפרומיס מהטנק ואם מצליח...
      .then(() => alert('המוצר נוסף לסל בהצלחה!'))
      .catch(() => alert('שגיאה בהוספת המוצר לסל'));
  };

  if (error) return <div>שגיאה: {error}</div>;
  if (!cake) return <div>טוען פרטי עוגה...</div>;

  return (
    <div className='StyleCake'>
      <h2 className='main-title'>{cake.name}</h2>
      <img src={`/${cake.imageUrl}`} alt={cake.name} className="animated-image" />
      <p>{cake.description}</p>
      <p>מחיר: {cake.price} ש"ח</p>
      <IconButton color="primary" onClick={handleAddToCart}>
        <AddShoppingCartIcon />
      </IconButton>
      <br />
    </div>
  );
}
