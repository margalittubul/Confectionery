import './stylelogin.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { addCustomer } from '../API/CustomerController';

import {
  TextField,
  Box,
  Stack,
  Button,
} from '@mui/material';

import { useDispatch } from 'react-redux';
import { login } from '../Redux/userSlice';


export default function Signin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    // ולידציה
    if (!name || name.length < 2) {
      setError('יש להזין שם (לפחות 2 תווים)');
      return;
    }
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('יש להזין אימייל תקין');
      return;
    }
    if (!city) {
      setError('יש להזין עיר מגורים');
      return;
    }
    if (!password || password.length < 4) {
      setError('יש להזין סיסמה (לפחות 4 תווים)');
      return;
    }

    try {
      const result = await addCustomer({ name, email, address: city, password });
      if (result && result._id) {
        dispatch(login({
          token: result.token,
          name: name,
          role: 'customer',
        }));

        localStorage.setItem('userToken', result.token);

        setSuccess('נרשמת בהצלחה!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError('הרשמה נכשלה');
      }
    } catch {
      setError('שגיאה בהרשמה, נסה שנית.');
    }
  };

  return (
    <div className='login-container'>
      <div>
        <img src='/img/ראווה.jpg' className='img-style' alt="register" />
      </div>

     <Box
  display="flex"
  flexDirection="column"
  justifyContent="center" 
  alignItems="center"
  sx={{ minWidth: 280, minHeight: 450 }}
>
  <TextField
    label="שם משתמש"
    value={name}
    onChange={(e) => setName(e.target.value)}
    sx={{ width: 250, mb: 2 }}
    variant="outlined"
  />
  <TextField
    label="מייל"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    sx={{ width: 250, mb: 2 }}
    variant="outlined"
  />
  <TextField
    label="עיר מגורים"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    sx={{ width: 250, mb: 2 }}
    variant="outlined"
  />
  <TextField
    label="סיסמא"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    sx={{ width: 250, mb: 4 }}
    variant="outlined"
  />

  <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
    <Button
      variant="contained"
      onClick={handleRegister}
      sx={{ backgroundColor: '#4A90E2', color: 'white', px: 3 }}
    >
      הרשמה
    </Button>
  </Stack>

  {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
  {success && <p style={{ color: 'green', marginTop: 10 }}>{success}</p>}
</Box>

    </div>
  );
}
