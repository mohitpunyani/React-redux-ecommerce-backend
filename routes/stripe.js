import express from "express";
const router = express.Router();

import { createPaymentIntent } from "../controllers/stripe.js";
// import route from "./user.js"
// middleware
import { authCheck } from "../middlewares/auth.js";

router.post("/create-payment-intent", authCheck, createPaymentIntent);

export default router;