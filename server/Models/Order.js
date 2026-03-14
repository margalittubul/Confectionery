import mongoose from "mongoose";
const { Types } = mongoose;
const OrderSchema = mongoose.Schema({
  customerId: {
    type: Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  products: [
    {
      productId: { type: Number, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [
      "הוזמן",
      "שולם",
      "אושרה הזמנה",
      "בתהליך...",
      "נשלח",
      "הגיע ליעד, בתאבון!!!",
    ],
    default: "הוזמן",
  },
  price: {
    type: Number,
    required: true,
  },
  hasShipping: {
    type: Boolean,
    required: true,
    default: false,
  },
  shippingLocation: {
    type: String,
    default: null,
  },
});
export default mongoose.model("Order", OrderSchema, "Orders");
