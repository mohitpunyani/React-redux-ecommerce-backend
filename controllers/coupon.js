import { couponModel } from "../models/coupon.js";
// create, remove, list

export const create = async (req, res) => {
  try {
    console.log(req.body);
    const { name, expiry, discount } = req.body.coupon;
    res.json(await new couponModel({ name, expiry, discount }).save());
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    res.json(await couponModel.findByIdAndDelete(req.params.couponId).exec());
  } catch (err) {
    console.log(err);
  }
};

export const list = async (req, res) => {
  try {
    res.json(await couponModel.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    console.log(err);
  }
};
