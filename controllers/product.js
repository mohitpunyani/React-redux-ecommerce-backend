import { productModel } from "../models/product.js";
import slugify from "slugify";
import userModel from "../models/user.js";
// import ProductCreateForm from "../../client/src/components/forms/ProductCreateForm.js";

export const create = async(req,res) =>{
    try{
        console.log(req.body);
        req.body.slug=slugify(req.body.title);
        const newProduct=await new productModel(req.body).save();
        res.json(newProduct);
    }
    catch(err){
        console.log(err);
        // res.status(400).send('create category failed')
        res.status(400).json({
            err : err.message,
        })
    }
}

export const listAll=async(req,res)=>{
    let products=await productModel.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt','desc']])
    .exec();
    res.json(products);

}
export const remove=async(req,res)=>{
    try{
        const deleted=await productModel.findOneAndRemove({slug :req.params.slug}).exec();
        res.json(deleted);
    }
    catch(err){
        console.log(err);
        return res.json(400).send('Product delete failed')
    }
}
export const read=async(req,res)=>{
    const product=await productModel.findOne({slug :req.params.slug})
    .populate("category")
    .populate("subs")
    .exec();
    res.json(product);
}
export const update=async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const updated=await productModel.findOneAndUpdate({slug :req.params.slug},req.body,
            {new :true}).exec();
            res.json(updated);
    }
    catch(err){
        console.log('Product update error--->',err);
        return res.status(400).send('Product update failed')
    }
}
// without pagination


// export const list=async(req,res)=>{
//     try{
//     //  created at, updated at ,desc/asc, 3
//         const {sort,order,limit} = req.body;
//         const products=await productModel.find({})
//         .populate('category')
//         .populate("subs")
//         .sort([[sort,order]])
//         .limit(limit)
//         .exec();
        
//         res.json(products);
//     }
//     catch (err)
//     {
//         console.log(err);
//     }
// }

// with pagination


export const list = async (req, res) => {
    // console.table(req.body);
    try {
      // createdAt/updatedAt, desc/asc, 3
      const { sort, order, page } = req.body;
      const currentPage = page || 1;
      const perPage = 3; // 3
  
      const products = await productModel.find({})
        .skip((currentPage - 1) * perPage)
        .populate("category")
        .populate("subs")
        .sort([[sort, order]])
        .limit(perPage)
        .exec();
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const productsCount = async (req, res) => {
    let total = await productModel.find({}).estimatedDocumentCount().exec();
    res.json(total);
  };
  export const productStar = async (req, res) => {
    const product = await productModel.findById(req.params.productId).exec();
    const user = await userModel.findOne({ email: req.user.email }).exec();
    // login user can add the rating

    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );
  
    // if user haven't left rating yet, push it new object to the rating array
    if (existingRatingObject === undefined) {
      let ratingAdded = await productModel.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } 
    else {
      // if user have already left rating, update it
      const ratingUpdated = await productModel.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  };
  

  export const listRelated = async (req, res) => {
    const product = await productModel.findById(req.params.productId).exec();
  
    const related = await productModel.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate("category")
      .populate("subs")
      // .populate("postedBy")
      .exec();
  
    res.json(related);
  };
const handleQuery=async(req,res,query)=>{
  const products=await productModel.find( { $text : { $search : query } } )
  .populate('category','_id name')
  .populate('subs','_id name')
  // .populate('postedBy','_id name')
  .exec();

  res.json(products);
}
const handlePrice = async (req, res, price) => {
  try {
    let products = await productModel.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};
const handleCategory=async (req,res,category)=>{
  try{
    let products=await productModel.find({category})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

    res.json(products);
  }
  catch(err){
    console.log(err);
  }
}

const handleStar = (req, res, stars) => {
  productModel.aggregate([
    {
      $project: {
        document: "$$ROOT",
        // title: "$title",
        floorAverage: {
          $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("AGGREGATE ERROR", err);
      productModel.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .exec((err, products) => {
          if (err) console.log("PRODUCT AGGREGATE ERROR", err);
          res.json(products);
        });
    });
};

const handleSub = async (req, res, sub) => {
  const products = await productModel.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handleShipping = async (req, res, shipping) => {
  const products = await productModel.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await productModel.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await productModel.find({ brand })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .exec();

  res.json(products);
};
export const searchFilters = async(req,res)=>{
  const {query,price,category,stars,sub,shipping,color,brand}=req.body;

  if(query)
  {
    console.log('query',query);
    await handleQuery(req,res,query);
  }
   // price [20, 200]
   if (price !== undefined) {
    console.log("price ---> ", price);
    await handlePrice(req, res, price);
  }
  if(category){
    console.log("category ---> ", category);
    await handleCategory(req, res, category);
  }
  if(stars){
    console.log("stars ---> ", stars);
    await handleStar(req, res, stars);
  }
  if (sub) {
    console.log("sub ---> ", sub);
    await handleSub(req, res, sub);
  }
  if (shipping) {
    console.log("shipping ---> ", shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("color ---> ", color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log("brand ---> ", brand);
    await handleBrand(req, res, brand);
  }
  
}