import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name: { type: String },
    email :{type:String, required: true, index: true},
    role: {type:String , default : "subscriber"},
    cart : {type:Array,default : []},
    address :{type:String},
    // wishlist :{type:Str}
},{timestamps : true})
const userModel = mongoose.model('User',userSchema);
export default userModel;