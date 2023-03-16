import express from 'express';
import fileUpload from 'express-fileupload';
import connectDB from './db/connectdb.js';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors'
import fs from 'fs';
const app = express();
const port = process.env.PORT || '8000'
const DATABASE_URL = process.env.DATABASE_URL|| "mongodb://127.0.0.1:27017/ecom-udemy"
// const DATABASE_URL = process.env.DATABASE_URL|| "mongodb://localhost:27017/ecom-udemy"
mongoose.set('strictQuery',true)
connectDB(DATABASE_URL);

// import routes

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import categoryRoutes from './routes/category.js'
import subRoutes from './routes/sub.js'
import productRoutes from './routes/product.js'
import cloudinaryRoutes from './routes/cloudinary.js'
import couponRoutes from "./routes/coupon.js";
import stripeRoutes from "./routes/stripe.js"
import adminRoutes from "./routes/admin.js"

// middlewares

app.use(morgan("dev"));
app.use(fileUpload({
    useTempFiles: true,
}))
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.raw())
app.use(cors());

// routes middleware

app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',categoryRoutes)
app.use('/api',subRoutes)
app.use('/api',productRoutes)
app.use('/api',cloudinaryRoutes)
app.use('/api',couponRoutes)
app.use('/api',stripeRoutes)
app.use('/api',adminRoutes)

// we are here 
app.listen(port, () => {
 console.log(`Server listening at http://localhost:${port}`)
})