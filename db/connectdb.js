import mongoose from 'mongoose'
const connectDB =async(DATABASE_URL)=>{
    try{
        await mongoose.connect(DATABASE_URL)
        console.log('Connected to database')
    }
    catch(err){
        console.log('Error connecting to database')
    }
}
export default connectDB;