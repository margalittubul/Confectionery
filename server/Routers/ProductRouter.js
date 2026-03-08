import express from "express";
import ProductsController from "../Controllers/ProductController.js";
import { authMiddleware, roleMiddleware } from "../authMiddleware.js";
import { upload } from "../uploadConfig.js";

const productRouter = express.Router();

productRouter.get("/", ProductsController.getList);
productRouter.get("/:id", ProductsController.getById);
productRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  ProductsController.add,
);
productRouter.post(
  "/upload",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "לא הועלתה תמונה" });
    const imageUrl = `img/${req.query.categoryFolder}/${req.file.filename}`;
    res.json({ imageUrl });
  },
);
productRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductsController.update,
);
productRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductsController.delete,
);

export default productRouter;
