import express from 'express';
const router=express.Router();

import {createOrUpdateUser} from '../controllers/authContoller.js';

//  middleware

import { adminCheck, authCheck } from '../middlewares/auth.js';

// controllers

import { create,list,update,remove,read } from '../controllers/sub.js';
// routes

router.post("/sub",authCheck,adminCheck,create)
router.get("/subs",list)
router.get("/sub/:slug",read)
router.put("/sub/:slug",authCheck,adminCheck,update)
router.delete("/sub/:slug",authCheck,adminCheck,remove)
export default router;