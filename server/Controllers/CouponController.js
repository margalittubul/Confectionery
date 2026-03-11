import Coupon from "../Models/Coupon.js";
import Order from "../Models/Order.js";

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
      console.log("Received coupon validation request");

      const { code, products, orderId } = req.body;

      console.log("Code:", code);
      console.log("Products:", products);
      console.log("Order ID:", orderId);

      const userId = req.user?.id;

      console.log("User ID:", userId);

      const coupon = await Coupon.findOne({ code, isActive: true });

      console.log("Found coupon:", coupon);

      if (!coupon) {
        return res.status(404).json({ message: "קופון לא תקין" });
      }

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return res.status(400).json({ message: "קופון לא בתוקף" });
      }

      if (coupon.clubOnly && userId) {
        const Customer = (await import("../Models/Customer.js")).default;
        const user = await Customer.findById(userId);
        if (!user || !user.is_club_member) {
          return res
            .status(403)
            .json({ message: "קופון זמין רק לחברי מועדון" });
        }
      }

      const order = await Order.findById(orderId).populate({
        path: "products.productId",
        populate: { path: "categoryId" }, 
      });

      console.log("Found order:", order);

      let relevantPrice = 0;

      for (const p of order.products) {

        console.log("Checking product:", p);
        console.log("Product ID:", p.productId);
        
        const product = p.productId;
        if (!product) continue;

        const productCategoryName = product.categoryId?.name;

        if (
          !coupon.categoryName ||
          productCategoryName === coupon.categoryName
        ) {
          relevantPrice += product.price * p.quantity;
        }
      }

      if (relevantPrice === 0) {
        return res
          .status(400)
          .json({ message: "אין מוצרים מתאימים לקופון זה" });
      }

      if (relevantPrice < coupon.minProductPrice) {
        return res
          .status(400)
          .json({ message: `מחיר מינימלי: ${coupon.minProductPrice}₪` });
      }

      if (coupon.maxProductPrice && relevantPrice > coupon.maxProductPrice) {
        return res
          .status(400)
          .json({ message: `מחיר מקסימלי: ${coupon.maxProductPrice}₪` });
      }

      let discount = 0;
      if (coupon.discountType === "fixed") {
        discount = coupon.discountValue;
      } else {
        discount = (relevantPrice * coupon.discountValue) / 100;
      }

      res.json({
        valid: true,
        discount,
        message: `הנחה של ${discount.toFixed(0)}₪`,
        coupon,
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
};

export default CouponController;
