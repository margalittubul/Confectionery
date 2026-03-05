import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  discountType: { type: String, enum: ["fixed", "percentage"], required: true },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  clubOnly: { type: Boolean, default: false },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "category",
    default: null
  },
  minProductPrice: { type: Number, default: 0 },
  maxProductPrice: { type: Number, default: null },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model("Coupon", couponSchema, "Coupons");
