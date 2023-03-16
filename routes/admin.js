import express from 'express';
// import auth from '../firebase.js';
const router=express.Router();

// middlewares
import { authCheck,adminCheck } from '../middlewares/auth.js';

import { orders,orderStatus } from '../controllers/admin.js';

// routes
router.get("/admin/orders", authCheck, adminCheck, orders);
router.put("/admin/order-status", authCheck, adminCheck, orderStatus);

export default router;
