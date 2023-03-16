import express from 'express';
const router=express.Router();

import {createOrUpdateUser} from '../controllers/authContoller.js';

//  middleware

import { adminCheck, authCheck } from '../middlewares/auth.js';
import { currentUser } from '../controllers/authContoller.js';

router.post("/create-or-update-user",authCheck,createOrUpdateUser)
router.post("/current-user",authCheck,currentUser)
router.post("/current-admin",authCheck,adminCheck,currentUser)

export default router;
