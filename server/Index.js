import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./database.js";

import productRouter from "./Routers/ProductRouter.js";
import categoryRouter from "./Routers/CategoryRouter.js";
import customerRouter from "./Routers/CustomerRouter.js";
import buyingRouter from "./Routers/BuyingRouter.js";
import orderRouter from "./Routers/OrderRouter.js";
import couponRouter from "./Routers/CouponRouter.js";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://confectionery.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(express.json());

app.use("/img", express.static(path.join(__dirname, "../client/public/img")));

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/customer", customerRouter);
app.use("/buying", buyingRouter);
app.use("/order", orderRouter);
app.use("/coupons", couponRouter);

const reactBuildPath = path.join(__dirname, "client/dist");
if (fs.existsSync(path.join(reactBuildPath, "index.html"))) {
  app.use(express.static(reactBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
  });
}

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}`),
);
