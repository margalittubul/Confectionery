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
      console.log("Received coupon validation request");

      const { code, products, orderId } = req.body;
      console.log("Code:", code);
      console.log("Products:", products);
      console.log("Order ID:", orderId);

      const userId = req.user?.id;
      console.log("User ID:", userId);

      // בדיקה אם הקופון קיים ותקין
      const coupon = await Coupon.findOne({ code, isActive: true });
      if (!coupon) return res.status(404).json({ message: "קופון לא תקין" });

      console.log("Coupon valid dates:", coupon.validFrom, coupon.validUntil);
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil)
        return res.status(400).json({ message: "קופון לא בתוקף" });

      console.log("Coupon club only:", coupon.clubOnly);

      // בדיקה אם המשתמש הוא חבר מועדון
      if (coupon.clubOnly && userId) {
        const Customer = (await import("../Models/Customer.js")).default;
        const user = await Customer.findById(userId);
        if (!user || !user.is_club_member) {
          return res
            .status(403)
            .json({ message: "קופון זמין רק לחברי מועדון" });
        }
      }

      console.log("Validating coupon against order...");

      // שליפת ההזמנה מהמסד
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "הזמנה לא נמצאה" });

      let discountTotal = 0;

      for (const p of order.products) {
        console.log("Checking productId from order:", p.productId);

        // שליפת המוצר לפי המספר שלנו
        const product = await Product.findOne({ id: p.productId });
        if (!product) continue;

        console.log("Found product in DB:", product);

        // שליפת קטגוריה לפי המספר
        let productCategory = null;
        if (product.categoryId != null) {
          productCategory = await Category.findOne({ id: product.categoryId });
        }

        console.log(
          "Product categoryId (DB ObjectId):",
          productCategory?._id,
          "Coupon category:",
          coupon.category,
        );

        // בדיקה אם המוצר מתאים לקופון
        if (
          !coupon.category ||
          (productCategory && productCategory._id.equals(coupon.category))
        ) {
          // בדיקות מינימום ומקסימום לכל מוצר
          if (product.price < coupon.minProductPrice) {
            console.log(`Product ${product.name} לא עומד במחיר מינימום`);
            continue;
          }
          if (
            coupon.maxProductPrice &&
            product.price > coupon.maxProductPrice
          ) {
            console.log(`Product ${product.name} לא עומד במחיר מקסימום`);
            continue;
          }

          // חישוב ההנחה עבור מוצר זה
          let productDiscount = 0;
          if (coupon.discountType === "fixed") {
            productDiscount = coupon.discountValue;
          } else {
            productDiscount = (product.price * coupon.discountValue) / 100;
          }

          discountTotal += productDiscount * p.quantity;
          console.log(
            `Product ${product.name} זכאי להנחה של ${productDiscount * p.quantity}₪`,
          );
        } else {
          console.log(`Product ${product.name} does NOT match coupon category`);
        }
      }

      console.log("Total discount for coupon:", discountTotal);

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
