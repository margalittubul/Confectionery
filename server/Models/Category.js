import mongoose from "mongoose";
const CategorySchema = mongoose.Schema({

name: {
    type: String,
    required: true,
},
imageUrl: {
    type: String,
    default: "",
}

});
export default mongoose.model("category", CategorySchema,"Categories");