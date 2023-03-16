import express from 'express';
const router=express.Router();
//  middleware
import { adminCheck, authCheck } from '../middlewares/auth.js';
// controllers
import { create,list,remove } from '../controllers/coupon.js';
// routes
router.post("/coupon",authCheck,adminCheck,create)
router.get("/coupons",list)
router.delete("/coupon/:couponId",authCheck,adminCheck,remove)
export default router;