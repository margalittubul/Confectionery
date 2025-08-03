import express from 'express';
import BuyingController from '../Controllers/BuyingController.js';
import { authMiddleware, roleMiddleware } from '../authMiddleware.js';

const buyingRouter = express.Router();

buyingRouter.get("/", authMiddleware,roleMiddleware('admin'), BuyingController.getList);
buyingRouter.get("/products/:customerId", authMiddleware, BuyingController.getProducts);
buyingRouter.get("/total-price", authMiddleware, BuyingController.calculateTotalPrice);
buyingRouter.get("/my-cart", authMiddleware, BuyingController.getById);
buyingRouter.post("/", authMiddleware, BuyingController.add);
buyingRouter.put("/:id", authMiddleware, BuyingController.update);
buyingRouter.post("/add-product", authMiddleware, BuyingController.addProduct);
buyingRouter.delete("/remove-product/:productId", authMiddleware, BuyingController.removeProduct);
buyingRouter.delete('/clear-cart', authMiddleware, BuyingController.clearCart);

export default buyingRouter;