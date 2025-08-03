import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../Redux/categoriesSlice';
import { addProductAsync } from '../Redux/productsSlice';

const AddProductForm = () => {
  const dispatch = useDispatch();

  const { items: categories, loading: loadingCategories, error: categoriesError } = useSelector(
    (state) => state.categories
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();// מניעת רענון הדף
    setLoading(true);
    setMessage(null);

    // ולידציה
    if (!name) {
      setMessage('יש להזין שם מוצר');
      setLoading(false);
      return;
    }
    if (!description) {
      setMessage('יש להזין תיאור');
      setLoading(false);
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      setMessage('יש להזין מחיר חוקי');
      setLoading(false);
      return;
    }
    if (!categoryId) {
      setMessage('יש לבחור קטגוריה');
      setLoading(false);
      return;
    }

    const productData = {
      ...(id && { id: parseInt(id) }),
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      categoryId: parseInt(categoryId),
    };

    try {
        // בדיקה האם הפעולה הסתיימה בהצלחה
      const resultAction = await dispatch(addProductAsync(productData));
      if (addProductAsync.fulfilled.match(resultAction)) {
        setMessage('המוצר נוסף בהצלחה!');
        setId('');
        setName('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        setCategoryId('');
      } else {
        setMessage('הוספת המוצר נכשלה, נסי שוב.');
      }
    } catch {
      setMessage('הוספת המוצר נכשלה, נסי שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
    >
      <Typography variant="h5" component="h2" textAlign="center">
        הוספת מוצר חדש
      </Typography>

      <TextField
        label="ID (אופציונלי)"
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <TextField
        label="שם המוצר"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextField
        label="תיאור"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        required
      />

      <TextField
        label="מחיר"
        type="number"
        inputProps={{ step: '0.01' }}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <TextField
        label="כתובת תמונה"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <FormControl required>
        <InputLabel id="category-select-label">קטגוריה</InputLabel>
        {loadingCategories ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <CircularProgress size={24} />
          </Box>
        ) : categoriesError ? (
          <Typography color="error" textAlign="center">
            שגיאה בטעינת קטגוריות
          </Typography>
        ) : (
          <Select
            labelId="category-select-label"
            value={categoryId}
            label="קטגוריה"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'מתווסף...' : 'הוסף מוצר'}
      </Button>

      {message && (
        <Typography color={message.includes('הצלחה') ? 'green' : 'error'} textAlign="center">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AddProductForm;

