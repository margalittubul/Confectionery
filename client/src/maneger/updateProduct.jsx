import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Select, MenuItem, Typography,
  CircularProgress, FormControl, InputLabel
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../Redux/categoriesSlice';
import {
  fetchProductById,
  updateProductAsync
} from '../Redux/productsSlice';

export default function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { items: categories, loading: categoriesLoading, error: categoriesError } = useSelector(state => state.categories);
  const { selectedProduct, loading: productLoading, error: productError } = useSelector(state => state.products);

  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setProduct({
        ...selectedProduct,
        categoryId: selectedProduct.categoryId || selectedProduct.category?._id || '',
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

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

    if (!product) {
      setMessage('❌ אין מוצר לעריכה');
      setSaving(false);
      return;
    }

    const updated = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    };

    try {
      const resultAction = await dispatch(updateProductAsync({ id: product._id || product.id, productData: updated }));
      if (updateProductAsync.fulfilled.match(resultAction)) {
        setMessage('✅ עודכן בהצלחה');
      } else {
        setMessage('❌ עדכון נכשל');
      }
    } catch (err) {
      setMessage('❌ שגיאה בעדכון');
    } finally {
      setSaving(false);
    }
  };

  if (productLoading || categoriesLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>טוען...</Typography>
      </Box>
    );
  }

  if (productError) {
    return <Typography color="error" textAlign="center">שגיאה בטעינת מוצר: {productError}</Typography>;
  }

  if (!product) {
    return <Typography color="error" textAlign="center">לא ניתן לטעון את פרטי המוצר</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" textAlign="center">עריכת מוצר</Typography>

      <TextField label="שם" name="name" value={product.name || ''} onChange={handleChange} required />
      <TextField label="תיאור" name="description" value={product.description || ''} onChange={handleChange} multiline rows={3} required />
      <TextField label="מחיר" name="price" type="number" value={product.price || ''} onChange={handleChange} required />
      <TextField label="תמונה" name="imageUrl" value={product.imageUrl || ''} onChange={handleChange} />

      <FormControl required>
        <InputLabel>קטגוריה</InputLabel>
        <Select
          name="categoryId"
          value={product.categoryId || ''}
          onChange={handleChange}
          label="קטגוריה"
        >
          {categories.map(cat => (
            <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" disabled={saving}>
        {saving ? 'שומר...' : 'שמור שינויים'}
      </Button>

      {message && <Typography textAlign="center" color={message.includes('✅') ? 'green' : 'error'}>{message}</Typography>}
    </Box>
  );
}
