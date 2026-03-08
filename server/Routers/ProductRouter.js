import express from "express";
import ProductsController from "../Controllers/ProductController.js";
import { authMiddleware, roleMiddleware } from "../authMiddleware.js";
import { upload, cloudinary } from "../uploadConfig.js";

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
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "לא הועלתה תמונה" });
      
      const folder = req.query.categoryFolder || "other";
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { folder }
      );
      
      res.json({ imageUrl: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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
