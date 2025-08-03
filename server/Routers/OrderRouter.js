import express from 'express';
import OrderController from '../Controllers/OrderController.js';
import { authMiddleware, roleMiddleware } from '../authMiddleware.js'; 

const orderRouter = express.Router();

orderRouter.get("/",authMiddleware, OrderController.getList);
orderRouter.get("/:id",authMiddleware, OrderController.getById);
orderRouter.post("/",authMiddleware, OrderController.add);
orderRouter.delete("/:id",authMiddleware, roleMiddleware('admin'), OrderController.delete);
orderRouter.put('/:id/status',authMiddleware, OrderController.updateOrderStatus);

export default orderRouter;