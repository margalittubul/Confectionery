import express from "express";
import { authMiddleware, roleMiddleware } from "../authMiddleware.js";
import CustomerController from "../Controllers/CustomerController.js";

const customerRouter = express.Router();

customerRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  CustomerController.getlist,
);
customerRouter.get("/profile", authMiddleware, CustomerController.profile);
customerRouter.get(
  "/by-email",
  authMiddleware,
  roleMiddleware("admin"),
  CustomerController.getByEmail,
);
customerRouter.post("/", CustomerController.add);
customerRouter.put("/join-club", authMiddleware, CustomerController.joinClub);
customerRouter.put(
  "/mark-first-purchase",
  authMiddleware,
  CustomerController.markFirstPurchaseUsed,
);
customerRouter.put(
  "/mark-birthday-discount",
  authMiddleware,
  CustomerController.markBirthdayDiscountUsed,
);
customerRouter.put("/:id", authMiddleware, CustomerController.update);
customerRouter.get("/:id", authMiddleware, CustomerController.getById);
customerRouter.post("/login", CustomerController.login);

export default customerRouter;
