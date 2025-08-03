import product from "../Models/Product.js";

const ProductsController = {

  // הצגת כל המוצרים או לפי קוד קטגוריה
getList: async (req, res) => {
  try {
    const { categoryId } = req.query;

    let products;

    if (categoryId) {
      const categoryNum = Number(categoryId);

      products = await product.find({ categoryId: categoryNum });
    } else {
      products = await product.find();
    }

    res.json({ products });
  } catch (err) {
    res.status(500).send('Server Error');
  }
},
 getById: async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    //מונוגס מאפשר קשר בין אוספים
    //populate מאפשר להביא את המידע של הקטגוריה
    const foundProduct = await product.findOne({ id: productId }).populate("categoryId");

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product: foundProduct });

  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
}

,

  // הוספת מוצר
  add: async (req, res) => {
    try {
      const { id,name, description, price, imageUrl, categoryId } = req.body;
      const newProduct = await product.create({
        id,
        name,
        description,
        price,
        imageUrl,
        categoryId,
      });
      res.status(201).json(newProduct);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  // עדכון מוצר
  update: async (req, res) => {
    try {
      const updatedProduct = await product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
      res.json(updatedProduct);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
};

export default ProductsController;
