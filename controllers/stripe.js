import userModel from "../models/user.js";
import cartModel from "../models/cart.js";
import { productModel } from "../models/product.js";
import { couponModel } from "../models/coupon.js";
import Stripe from "stripe";
import { config } from "dotenv";
import dotenv from "dotenv"
import path from "path";
// console.log(process.env.STRIPE_SECRET)
dotenv.config(path)
const stripekey=process.env.STRIPE_SECRET;
const stripe = new Stripe(stripekey)
export const createPaymentIntent = async (req, res) => {
    // console.log(req.body);
    const { couponApplied } = req.body;
  
    // later apply coupon
    // later calculate price
  
    // 1 find user
    const user = await userModel.findOne({ email: req.user.email }).exec();
    // 2 get user cart total
    const { cartTotal, totalAfterDiscount } = await cartModel.findOne({
      orderdBy: user._id,
    }).exec();
    // console.log("CART TOTAL", cartTotal, "AFTER DIS%", totalAfterDiscount);
  
    let finalAmount = 0;
  
    if (couponApplied && totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    } else {
      finalAmount = cartTotal * 100;
    }
  
    // create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount ,
      currency: "usd",
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    });
  };
  