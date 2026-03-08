import category from "../Models/Category.js";

const CategoryController = {
  getList: async (req, res) => {
    try {
      const categories = await category.find();
      res.json({ categories });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  getById: async (req, res) => {
    try {
      const cat = await category.findById(req.params.id);
      if (!cat) return res.status(404).json({ message: "Category not found" });
      res.json(cat);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  add: async (req, res) => {
    try {
      const { name, imageUrl } = req.body;

      const lastCategory = await category.findOne().sort({ id: -1 });
      const newId = lastCategory ? lastCategory.id + 1 : 1;

      const newCategory = await category.create({ id: newId, name, imageUrl });
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
