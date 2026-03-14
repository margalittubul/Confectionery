import mongoose from "mongoose";
const CustomerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  password: {
    type: String,
    required: true,
  },
  is_club_member: {
    type: Boolean,
    default: false,
  },
  birth_date: {
    type: Date,
    default: null,
  },
  first_club_purchase_used: {
    type: Boolean,
    default: false,
  },
  birthday_discount_used_year: {
    type: Number,
    default: 0,
  },
  phone: {
    type: String,
    minlength: 9,
    default: "",
  },
});
export default mongoose.model("Customer", CustomerSchema, "Users");
