import Coupon from "../Models/Coupon.js";
import Order from "../Models/Order.js";
import Product from "../Models/Product.js";
import Category from "../Models/Category.js";

const CouponController = {
  create: async (req, res) => {
    try {
      const coupon = await Coupon.create(req.body);
      res.status(201).json(coupon);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const coupons = await Coupon.find().populate("category");
      res.json(coupons);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  getActive: async (req, res) => {
    try {
      const now = new Date();
      const coupons = await Coupon.find({
        isActive: true,
        validFrom: { $lte: now },
        validUntil: { $gte: now },
      }).populate("category");
      res.json(coupons);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  getById: async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id).populate("category");
      if (!coupon) {
        return res.status(404).json({ message: "קופון לא נמצא" });
      }
      res.json(coupon);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  update: async (req, res) => {
    try {
      const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!coupon) {
        return res.status(404).json({ message: "קופון לא נמצא" });
      }
      res.json(coupon);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  delete: async (req, res) => {
    try {
      const coupon = await Coupon.findByIdAndDelete(req.params.id);
      if (!coupon) {
        return res.status(404).json({ message: "קופון לא נמצא" });
      }
      res.json({ message: "קופון נמחק בהצלחה" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  validateCoupon: async (req, res) => {
    try {
      const { code, products, orderId } = req.body;
      const userId = req.user?.id;

      const coupon = await Coupon.findOne({ code, isActive: true });
      if (!coupon) return res.status(404).json({ message: "קופון לא תקין" });

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil)
        return res.status(400).json({ message: "קופון לא בתוקף" });

      if (coupon.clubOnly && userId) {
        const Customer = (await import("../Models/Customer.js")).default;
        const user = await Customer.findById(userId);
        if (!user || !user.is_club_member)
          return res
            .status(403)
            .json({ message: "קופון זמין רק לחברי מועדון" });
      }

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "הזמנה לא נמצאה" });

      let discountTotal = 0;

      for (const p of order.products) {
        const product = await Product.findOne({ id: p.productId });
        if (!product) continue;

        let productCategory = null;
        if (product.categoryId != null) {
          productCategory = await Category.findOne({ id: product.categoryId });
        }

        if (
          !coupon.category ||
          (productCategory && productCategory._id.equals(coupon.category))
        ) {
          if (product.price < coupon.minProductPrice) continue;
          if (coupon.maxProductPrice && product.price > coupon.maxProductPrice)
            continue;

          let productDiscount =
            coupon.discountType === "fixed"
              ? coupon.discountValue
              : (product.price * coupon.discountValue) / 100;

          discountTotal += productDiscount * p.quantity;
        }
      }

      if (discountTotal === 0)
        return res.status(400).json({ message: "אין מוצרים מתאימים להנחה" });

      res.json({
        valid: true,
        discount: discountTotal,
        message: `סה"כ הנחה: ${discountTotal.toFixed(0)}₪`,
        coupon,
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e.message });
    }
  },
};

export default CouponController;
