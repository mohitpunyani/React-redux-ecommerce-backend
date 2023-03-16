import { getAuth } from "firebase-admin/auth";
import userModel from "../models/user.js";
import auth from "../firebase/index.js";
export const authCheck = async (req, res, next) => {
    console.log(req.headers.authtoken) // token
    // console.log("i am working")
    try{
        console.log("i am working")
        const firebaseUser=await auth.verifyIdToken(req.headers.authtoken)
        console.log("firebase user in auth check",firebaseUser)
        req.user=firebaseUser;
        console.log(req.user)
        next();
    }
    catch(err){
        console.log("i am not working")
        res.status(401).json({
            err:"invalid or expired token"
        })
    }

}
export const adminCheck =async(req, res, next) => {
    const {email}=req.user;
    const adminUser=await userModel.findOne({email}).exec();
    if(adminUser.role !=="admin"){
        res.status(403).json({
            err : 'Admin resource. access denied'
        });
    } 
    else{
        next();
    }
}
