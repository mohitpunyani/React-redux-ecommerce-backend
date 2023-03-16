import categoryModel from "../models/Category.js";
import subModel from "../models/sub.js";
import slugify from "slugify";
import { productModel } from "../models/product.js";
export const create = async (req, res) => {
    try {
        const { name } = req.body;
        // const category=await new categoryModel({name ,slug : slugify(name)}).save();
        // res.json(category);
        res.json(await new categoryModel({ name, slug: slugify(name) }).save());
        // console.log(category)
    }
    catch (err) {
        console.log(err);
        res.status(400).send('create category failed')
    }
}
export const list = async (req, res) => {
    res.json(await categoryModel.find().sort({ createdAt: -1 }).exec())
}
export const read = async (req, res) => {
    let category = await categoryModel.findOne({ slug: req.params.slug }).exec();
    // res.json(category);
    const products =await productModel.find({category}).exec();
    res.json({
        category,
        products,
    })

}
export const update = async (req, res) => {
    // mainly we have to update the name of the category
    const { name } = req.body;
    try {
        const updated = await categoryModel.findOneAndUpdate
            ({ slug: req.params.slug }, { name, slug: slugify(name) },{new :true})
    res.json(updated);
    }
    catch (err) {
        res.status(400).send('category update failed')

    }
}
export const remove = async (req, res) => {
    try {
        const deleted = await categoryModel.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    }
    catch (err) {
        res.status(400).send("Create delete failed")
    }
}
export const getSubs=async(req, res) => {
    subModel.find({ parent: req.params._id }).exec((err, subs) => {
        if (err) console.log(err);
        res.json(subs);
    })
}