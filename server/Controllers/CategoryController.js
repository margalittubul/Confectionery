import category from "../Models/Category.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CategoryController = {
  getList: async (req, res) => {
    try {
      const categories = await category.find();
      res.json({ categories });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  add: async (req, res) => {
    try {
      const { name, imageUrl, folderName } = req.body;
      
      if (folderName) {
        const folderPath = path.join(__dirname, "../../client/public/img", folderName);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
      }
      
      const newCategory = await category.create({ name, imageUrl });
      res.status(201).json(newCategory);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  update: async (req, res) => {
    try {
      const updatedCategory = await category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedCategory)
        return res.status(404).json({ message: "Category not found" });
      res.json(updatedCategory);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  delete: async (req, res) => {
    try {
      const deletedCategory = await category.findByIdAndDelete(req.params.id);
      if (!deletedCategory)
        return res.status(404).json({ message: "Category not found" });
      res.json({ message: "Category deleted" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
};

export default CategoryController;
