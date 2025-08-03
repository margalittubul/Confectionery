import { useState } from 'react';
import {
  TextField,
  Box,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import { addCustomer } from '../API/CustomerController';
import { useNavigate } from 'react-router-dom';

export default function AddAdmin() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage('');

    // ולידציה
    if (!form.name || form.name.length < 2) {
      setMessage('יש להזין שם (לפחות 2 תווים)');
      return;
    }
    if (!form.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      setMessage('יש להזין אימייל תקין');
      return;
    }
    if (!form.city) {
      setMessage('יש להזין עיר');
      return;
    }
    if (!form.password || form.password.length < 4) {
      setMessage('יש להזין סיסמה (לפחות 4 תווים)');
      return;
    }


    try {
      const result = await addCustomer({
        name: form.name,
        email: form.email,
        address: form.city,
        password: form.password,
        role: 'admin', 
      });

      if (result && result._id) {
        setMessage('✅ מנהל נוצר בהצלחה');
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setMessage('❌ יצירה נכשלה');
      }
    } catch (err) {
      setMessage('❌ שגיאה ביצירת מנהל');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        יצירת מנהל חדש
      </Typography>

      <TextField name="name" label="שם" value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField name="email" label="אימייל" value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField name="city" label="עיר" value={form.city} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField name="password" label="סיסמה" type="password" value={form.password} onChange={handleChange} sx={{ mb: 3 }} />

      <Stack direction="row" justifyContent="center">
        <Button variant="contained" onClick={handleSubmit}>
          צור מנהל
        </Button>
      </Stack>

      {message && (
        <Typography sx={{ mt: 2 }} color={message.includes('✅') ? 'green' : 'red'}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
