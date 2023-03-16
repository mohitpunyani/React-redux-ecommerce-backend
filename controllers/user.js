import userModel from "../models/user.js";
import { productModel } from "../models/product.js";
import cartModel from "../models/cart.js";
import { couponModel } from "../models/coupon.js";
import { orderModel } from "../models/order.js";
export const userCart = async (req, res) => {
    console.log(req.body);
    const { cart } = req.body;
    let products = [];
    const user = await userModel.findOne({ email: req.user.email }).exec();

    // check if cart with logged in user id already exist

    let cartExistByThisUser = await cartModel.findOne({ orderBy: user._id }).exec();
    if (cartExistByThisUser) {
        cartExistByThisUser.remove();
        console.log('remove old cart')
    }
    for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i]._id;

        object.count = cart[i].count;
        object.colort = cart[i].color;
        let productFromDb = await productModel.findById(cart[i]._id).select("price").exec();
        object.price = productFromDb.price;
        products.push(object);
    }
    console.log('products'.products)
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
        cartTotal += products[i].price * products[i].count;

    }
    console.log("cartTotal", cartTotal);
    let newCart = await new cartModel({
        products,
        cartTotal,
        orderdBy: user._id,
    }).save();
    console.log('newCart', newCart);
    res.json({ ok: true });
}
export const getUserCart = async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email }).exec();
    const cart = await cartModel.findOne({ orderdBy: user._id }).populate('products.product','_id title price totalAfterDiscount')
        .exec();
    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
}

export const emptyCart = async (req, res) => {
    console.log("empty cart");
    const user = await userModel.findOne({ email: req.user.email }).exec();
  
    const cart = await cartModel.findOneAndRemove({ orderdBy: user._id }).exec();
    res.json(cart);
  };
  export const saveAddress = async (req, res) => {
    const userAddress = await userModel.findOneAndUpdate(
      { email: req.user.email },
      { address: req.body.address }
    ).exec();
  
    res.json({ ok: true });
  };
  export const applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body;
    console.log("COUPON", coupon);
  
    const validCoupon = await couponModel.findOne({ name: coupon }).exec();
    if (validCoupon === null) {
      return res.json({
        err: "Invalid coupon",
      });
    }
    console.log("VALID COUPON", validCoupon);
  
    const user = await userModel.findOne({ email: req.user.email }).exec();
  
    let { products, cartTotal } = await cartModel.findOne({ orderdBy: user._id })
      .populate("products.product", "_id title price")
      .exec();
  
    console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);
  
    // calculate the total after discount
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2); // 99.99
  
    cartModel.findOneAndUpdate(
      { orderdBy: user._id },
      { totalAfterDiscount },
      { new: true }
    ),exec();
  
    res.json(totalAfterDiscount);
  };
  export const createOrder = async (req, res) => {
    // console.log(req.body);
    // return;
    const { paymentIntent } = req.body.stripeResponse;
  
    const user = await userModel.findOne({ email: req.user.email }).exec();
  
    let { products } = await cartModel.findOne({ orderdBy: user._id }).exec();
  
    let newOrder = await new orderModel({
      products,
      paymentIntent,
      orderdBy: user._id,
    }).save();
  
    // decrement quantity, increment sold
    let bulkOption = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id }, // IMPORTANT item.product
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
  
    let updated = await productModel.bulkWrite(bulkOption, {});
    console.log("PRODUCT QUANTITY-- AND SOLD++", updated);
  
    console.log("NEW ORDER SAVED", newOrder);
    res.json({ ok: true });
  };
  
  export const orders= async(req,res)=>{
    let user=await userModel.findOne({email:req.body.email}).exec();
    let userOrders=await orderModel.find({orderdBy : user. _id})
    .populate("products.product")
    .exec();
  res.json(userOrders);
  }