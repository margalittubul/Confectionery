import express from "express";
import CategoryController from "../Controllers/CategoryController.js";
import { authMiddleware, roleMiddleware } from "../authMiddleware.js";
import { upload, cloudinary } from "../uploadConfig.js";

const categoryRouter = express.Router();

categoryRouter.get("/", CategoryController.getList);
categoryRouter.get("/:id", CategoryController.getById);
categoryRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  CategoryController.add,
);
categoryRouter.post(
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
categoryRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  CategoryController.update,
);
categoryRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  CategoryController.delete,
);

export default categoryRouter;
