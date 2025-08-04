import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './database.js';

import productRouter from './Routers/ProductRouter.js';
import categoryRouter from './Routers/CategoryRouter.js';
import customerRouter from './Routers/CustomerRouter.js';
import buyingRouter from './Routers/BuyingRouter.js';
import orderRouter from './Routers/OrderRouter.js';

const app = express();
const port = process.env.PORT || 3000; // כדי ש-Render תוכל לקבוע את הפורט

connectDB();

// 🟢 שלב 1 – הגדרת CORS עם הדומיין של הלקוח
const allowedOrigins = ['https://confectionery.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 🟢 שלב 2 – מענה לבקשות OPTIONS
app.options('*', cors());

app.use(bodyParser.json());
app.use(express.json());

// ראוטים
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/customer', customerRouter);
app.use('/buying', buyingRouter);
app.use('/order', orderRouter);

// הפעלת השרת
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
