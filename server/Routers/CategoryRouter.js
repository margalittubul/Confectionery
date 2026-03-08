import express from "express";
import CategoryController from "../Controllers/CategoryController.js";
import { authMiddleware, roleMiddleware } from "../authMiddleware.js";
import { upload } from "../uploadConfig.js";

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
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "לא הועלתה תמונה" });
    const imageUrl = `img/${req.query.categoryFolder}/${req.file.filename}`;
    res.json({ imageUrl });
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
