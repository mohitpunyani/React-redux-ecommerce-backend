import mongoose from "mongoose"
import { ObjectId } from "mongoose";
const subSchema = new mongoose.Schema({
    name: {
        type: String, trim: true, required: 'name is required', minlength: [2, 'Too short'],
        maxlength: [32, 'Too long'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    parent:
    {type:ObjectId , ref: "Category" ,required: true},
},
    { timestamps: true }
)
const subModel=mongoose.model('Sub',subSchema);
export default subModel;