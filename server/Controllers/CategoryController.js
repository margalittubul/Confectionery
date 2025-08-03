import category from "../Models/Category.js";

const CategoryController = {
    //הצגת קטגוריות
    getList: async (req, res) => {
        try {
            const categories = await category.find();
            res.json({ categories });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    //הוספת קטרגוריה
    add: async (req, res) => {
        try {
            const { name } = req.body;
            const newCategory = await category.create({ name });
            res.status(201).json(newCategory);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    //עדכון קטגוריה
    update: async (req, res) => {
        try {
            const updatedCategory = await category.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }//מחזיר את הקטגוריה המעודכנת
            );
            if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
            res.json(updatedCategory);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
};

export default CategoryController;