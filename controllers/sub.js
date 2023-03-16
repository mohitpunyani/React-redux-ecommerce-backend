import subModel from "../models/sub.js";
import slugify from "slugify";
import { productModel } from "../models/product.js";
export const create = async (req, res) => {
    try {
        const { name,parent } = req.body;
        // const category=await new categoryModel({name ,slug : slugify(name)}).save();
        // res.json(category);
        res.json(await new subModel({ name, parent,slug: slugify(name) }).save());
        // console.log(category)
    }
    catch (err) {
        console.log('sub create err ------->',err);
        res.status(400).send('create sub failed')
    }
}
export const list = async (req, res) => {
    res.json(await subModel.find().sort({ createdAt: -1 }).exec())
}
export const read = async (req, res) => {
    let sub = await subModel.findOne({ slug: req.params.slug }).exec();
    const products = await productModel.find({ subs: sub })
    .populate("category")
    .exec();

    res.json({
        sub,
        products,
    });

}
export const update = async (req, res) => {
    // mainly we have to update the name of the category
    const { name ,parent } = req.body;
    try {
        const updated = await subModel.findOneAndUpdate
            ({ slug: req.params.slug }, { name,parent, slug: slugify(name) },{new :true})
    res.json(updated);
    }
    catch (err) {
        res.status(400).send('sub update failed')

    }
}
export const remove = async (req, res) => {
    try {
        const deleted = await subModel.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    }
    catch (err) {
        res.status(400).send("sub delete failed")
    }
}