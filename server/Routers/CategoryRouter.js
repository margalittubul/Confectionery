import express from 'express';
import CategoryController from '../Controllers/CategoryController.js';
import { authMiddleware, roleMiddleware } from '../authMiddleware.js'; 

const categoryRouter = express.Router();

categoryRouter.get("/", CategoryController.getList);
categoryRouter.post("/", authMiddleware, roleMiddleware('admin'), CategoryController.add);
categoryRouter.put("/:id", authMiddleware, roleMiddleware('admin'), CategoryController.update);

export default categoryRouter;