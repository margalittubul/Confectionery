import express from 'express';
import { authMiddleware, roleMiddleware } from '../authMiddleware.js';
import CouponController from '../Controllers/CouponController.js';

const couponRouter = express.Router();

couponRouter.post("/", authMiddleware, roleMiddleware('admin'), CouponController.create);
couponRouter.get("/", CouponController.getAll);
couponRouter.get("/:id", authMiddleware, roleMiddleware('admin'), CouponController.getById);
couponRouter.put("/:id", authMiddleware, roleMiddleware('admin'), CouponController.update);
couponRouter.delete("/:id", authMiddleware, roleMiddleware('admin'), CouponController.delete);
couponRouter.post("/validate", authMiddleware, CouponController.validateCoupon);

export default couponRouter;
