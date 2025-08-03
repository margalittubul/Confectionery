import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginCustomer } from '../API/CustomerController';
import { useDispatch } from 'react-redux';
import { login  } from '../Redux/userSlice';

import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Stack,
  Button
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginCustomer({ name, password });

      if (response.token) {
        dispatch(login({
          token: response.token,
          name: name,
          role: response.role || 'customer',
        }));

        localStorage.setItem('userToken', response.token);

        navigate('/Picthur');

        window.dispatchEvent(new Event("user-logged-in"));
        
      } else {
        setError('משתמש לא נמצא. אנא הירשם.');
        navigate('/login');
      }
    } catch (err) {
      setError('שגיאה בהתחברות. ודא שהפרטים נכונים.');
    }
  };

  return (
    <div className='login-container'>
      <div>
        <img src='/img/ראווה.jpg' className='img-style' alt="login" />
      </div>

      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <TextField
          label="שם משתמש"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: 250, mb: 2 }}
          variant="outlined"
        />

        <TextField
          type={show ? 'text' : 'password'}
          label="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: 250, mb: 3 }}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(!show)}>
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ backgroundColor: '#4A90E2', color: 'white', px: 3 }}
          >
            אישור
          </Button>

          <Link to='/login'>
            <Button
              variant="outlined"
              sx={{ color: '#333', borderColor: '#aaa', px: 3 }}
            >
              הרשמה
            </Button>
          </Link>
        </Stack>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </Box>
    </div>
  );
}
