import express from "express";
import ProductsController from '../Controllers/ProductController.js'
import { authMiddleware, roleMiddleware } from '../authMiddleware.js'; 

const productRouter = express.Router();

productRouter.get("/", ProductsController.getList);
productRouter.get("/:id", ProductsController.getById);
productRouter.post("/",authMiddleware,roleMiddleware('admin'), ProductsController.add);
productRouter.put("/:id",authMiddleware, roleMiddleware('admin'), ProductsController.update);

export default productRouter;

