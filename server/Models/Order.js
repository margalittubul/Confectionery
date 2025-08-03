import mongoose from "mongoose";
const { Types} = mongoose;
const OrderSchema = mongoose.Schema({
customerId: {
    type: Types.ObjectId,
    ref: "Customer",
    required: true,
},
products: [
    {
      productId: { type: Number, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
],
orderDate: {
    type: Date,
    default: Date.now,
},
status: {
    type: String,
    enum: ["הוזמן", "שולם", "אושרה הזמנה"],
    default: "pending"
  },
price: {
    type: Number,
    required: true,
}
});
export default mongoose.model("Order",OrderSchema,"Orders");