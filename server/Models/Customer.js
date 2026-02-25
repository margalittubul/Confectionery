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
});
export default mongoose.model("Customer", CustomerSchema, "Users");
