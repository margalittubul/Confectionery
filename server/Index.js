
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectDB from "./database.js";


import productRouter from './Routers/ProductRouter.js'
import categoryRouter from './Routers/CategoryRouter.js'
import customerRouter  from './Routers/CustomerRouter.js';  
import buyingRouter from './Routers/BuyingRouter.js';
import orderRouter from './Routers/OrderRouter.js'

const app = express()
const port = 3000;
connectDB();

app.use(cors())
app.use(bodyParser.json())
app.use(express.json());

app.use('/products', productRouter)
app.use('/categories', categoryRouter)
app.use('/customer',customerRouter)
app.use('/buying',buyingRouter)
app.use('/order',orderRouter)

app.listen(port, () =>
    console.log(`Example app listening on http://localhost:${port}`)
)

