import Buying from "../Models/Buying.js";
import Product from "../Models/Product.js";

const BuyingController = {
  getList: async (req, res) => {
    try {
      const buyingList = await Buying.find().populate("products.productId");
      res.json({ buying: buyingList });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  getById: async (req, res) => {
    try {
      const customerId = req.user.id;
      const buyingItem = await Buying.findOne({ customerId });
      if (!buyingItem)
        return res.status(404).json({ message: "Buying cart not found" });
      res.json(buyingItem);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  addProduct: async (req, res) => {
    try {
      const customerId = req.user.id;
      const { productId, quantity } = req.body;
      const numProductId = Number(productId);

      if (!numProductId || quantity <= 0) {
        return res.status(400).json({ message: "Invalid input" });
      }

      let cart = await Buying.findOne({ customerId });
      if (!cart) {
        const newDoc = new Buying({
          customerId,
          products: [{ productId: numProductId, quantity }],
        });
        cart = newDoc;
      } else {
        const existingProduct = cart.products.find(
          (p) => p.productId === numProductId,
        );
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ productId: numProductId, quantity });
        }
      }
      await cart.save();
      res.status(200).json(cart);
    } catch (e) {
      console.error(" שגיאה בשמירה למסד:");
      console.error(e);
      res.status(500).json({
        message: e.message,
        errors: e.errors,
        stack: e.stack,
      });
    }
  },
  getProducts: async (req, res) => {
    try {
      const customerId = req.user.id;
      const buyingCart = await Buying.findOne({ customerId }).populate(
        "products.productId",
      );
      if (!buyingCart)
        return res.status(404).json({ message: "Cart not found" });
      res.json(buyingCart.products);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  removeProduct: async (req, res) => {
    try {
      const customerId = req.user.id;
      const productId = Number(req.params.productId);

      const cart = await Buying.findOne({ customerId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.products = cart.products.filter(
        (item) => item.productId !== productId,
      );
      await cart.save();

      res.json({ success: true });
    } catch (error) {
      console.error("Error removing product:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  calculateTotalPrice: async (req, res) => {
    try {
      const customerId = req.user.id;
      const buyingCart = await Buying.findOne({ customerId });
      if (!buyingCart)
        return res.status(404).json({ message: "Cart not found" });
      let totalPrice = 0;
      for (const item of buyingCart.products) {
        const product = await Product.findOne({ id: item.productId });
        if (!product || typeof product.price !== "number") {
          console.warn("Invalid product or missing price:", item.productId);
          continue;
        }
        totalPrice += product.price * item.quantity;
      }
      res.json({ totalPrice });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  add: async (req, res) => {
    try {
      const customerId = req.user.id;
      const { products } = req.body;
      const newCart = await Buying.create({ customerId, products });
      res.status(201).json(newCart);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  updateQuantity: async (req, res) => {
    try {
      const customerId = req.user.id;
      const { productId, quantity } = req.body;
      const numProductId = Number(productId);

      const cart = await Buying.findOne({ customerId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const product = cart.products.find((p) => p.productId === numProductId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      product.quantity = quantity;
      await cart.save();
      res.json(cart);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  clearCart: async (req, res) => {
    try {
      const customerId = req.user.id;
      const result = await Buying.deleteOne({ customerId });

      if (result.deletedCount === 0) {
        return res.status(200).json({ message: "Cart was already empty" });
      }

      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};

export default BuyingController;
