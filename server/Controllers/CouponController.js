import Coupon from "../Models/Coupon.js";

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
      const coupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
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
      const { code, orderPrice, categoryId } = req.body;
      const userId = req.user?.id;

      const coupon = await Coupon.findOne({ code, isActive: true });
      
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
          return res.status(403).json({ message: "קופון זמין רק לחברי מועדון" });
        }
      }

      if (coupon.category && categoryId && coupon.category.toString() !== categoryId) {
        return res.status(400).json({ message: "קופון לא תקף לקטגוריה זו" });
      }

      if (orderPrice < coupon.minProductPrice) {
        return res.status(400).json({ message: `מחיר מינימלי: ${coupon.minProductPrice}₪` });
      }

      if (coupon.maxProductPrice && orderPrice > coupon.maxProductPrice) {
        return res.status(400).json({ message: `מחיר מקסימלי: ${coupon.maxProductPrice}₪` });
      }

      let discount = 0;
      if (coupon.discountType === "fixed") {
        discount = coupon.discountValue;
      } else {
        discount = (orderPrice * coupon.discountValue) / 100;
      }

      res.json({
        valid: true,
        discount,
        message: `הנחה של ${discount}₪`,
        coupon
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
};

export default CouponController;
