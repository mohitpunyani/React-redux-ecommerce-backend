import express from 'express';
const router=express.Router();

// import {createOrUpdateUser} from '../controllers/authContoller.js';

//  middleware

import { adminCheck, authCheck } from '../middlewares/auth.js';

// controllers

import { create ,listAll,remove,read,update,list,productsCount,productStar,

listRelated,searchFilters} from '../controllers/product.js';
// routes

router.post("/product",authCheck,adminCheck,create)
router.get("/products/total",productsCount)
router.get("/products/:count",listAll)
router.delete("/product/:slug",authCheck,adminCheck,remove)
router.get("/product/:slug",read)
router.put("/product/:slug",authCheck,adminCheck,update);
router.post("/products",list);
// router.get("/products/total",productsCount)

// rating
router.put("/product/star/:productId", authCheck, productStar);
// related
router.get("/product/related/:productId", listRelated);
//search
router.post("/search/filters",searchFilters)

export default router;