import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './Redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <Provider store={store}>
        <App />
    </Provider>
 
  </StrictMode>,
)
