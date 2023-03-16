import userModel from "../models/user.js";
import "../models/user.js";
export const createOrUpdateUser = async (req,res)=>{
    const {name,picture,email}=req.user;
    const user=await userModel.findOneAndUpdate
    ({email},{name :email.split("@")[0],picture},{new:true});
    if(user){
      console.log("USER UPDATED",user)
      res.json(user)
    }
    else{
      const newUser = await new userModel({
        email,
        name : email.split("@")[0],
        picture,

      }).save();
      console.log("User created",newUser)
      res.json(newUser)

    }
}
export const currentUser=async (req,res)=>{
  userModel.findOne({email :req.user.email}).exec((err,user)=>{
    if(err)
      throw new Error(err);
    res.json(user);
  })
}