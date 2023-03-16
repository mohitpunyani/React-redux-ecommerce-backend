import express from 'express';
const router=express.Router();

import {createOrUpdateUser} from '../controllers/authContoller.js';

//  middleware

import { adminCheck, authCheck } from '../middlewares/auth.js';

// controllers

import { create,list,update,remove,read,getSubs } from '../controllers/category.js';
// routes

router.post("/category",authCheck,adminCheck,create)
router.get("/categories",list)
router.get("/category/:slug",read)
router.put("/category/:slug",authCheck,adminCheck,update)
router.delete("/category/:slug",authCheck,adminCheck,remove)
router.get("/category/subs/:_id",getSubs)
export default router;