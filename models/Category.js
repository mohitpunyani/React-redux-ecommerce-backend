import mongoose from "mongoose"
const categorySchema = new mongoose.Schema({
    name: {
        type: String, trim: true, required: 'name is required', minlength: [2, 'Too short'],
        maxlength: [32, 'Too long'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    }
},
    { timestamps: true }
)
const categoryModel=mongoose.model('Category',categorySchema);
export default categoryModel