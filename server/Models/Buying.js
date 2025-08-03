import mongoose from "mongoose";
const BuyingSchema = mongoose.Schema({

customerId: {
    type: String,
    ref: "Customer",
    required: true,
},
products:[
    {
      productId: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      _id: false
    }
]

});
export default mongoose.model("Buying",BuyingSchema,"Buying");