import express from 'express';
import { userCart,getUserCart ,emptyCart,saveAddress,applyCouponToUserCart,createOrder,orders} from 
'../controllers/user.js';
import { authCheck } from '../middlewares/auth.js';
const router=express.Router();

router.post('/user/cart',authCheck,userCart); // save cart
router.get('/user/cart',authCheck,getUserCart); //get cart
router.delete("/user/cart", authCheck, emptyCart); // empty cart
router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, createOrder);
router.get('/user/orders',authCheck,orders);
// coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

// router.get('/user',(req,res)=>{
//     res.send("user api end point")
// })
export default router;