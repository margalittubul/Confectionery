import mongoose from "mongoose";
import { Types } from "mongoose";
const ProductSchema = mongoose.Schema({

id:{
    type: Number,
    auto: true,
},
name: {
    type: String,
    required: true,
},
description:{
    type: String,
    default: "",
},
price:{
    type: Number,
    required: true,
},
imageUrl:{
    type: String,
    required: true,
},
categoryId:{
    type: Number,
    required: true
}

});
export default mongoose.model("product", ProductSchema,"Products");