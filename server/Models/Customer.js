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
    enum: ['customer', 'admin'], 
    default: 'customer',
},
password: {
    type: String,
    required: true
},

});
export default mongoose.model("Customer", CustomerSchema,"Users");