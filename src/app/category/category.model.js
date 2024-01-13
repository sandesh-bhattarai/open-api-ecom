const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        min: 3,
        unique: true
    },
    description: String, 
    slug: {
        type: String,
        unique: true,
        required: true
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        requried: false
    },
    image: String, 
    status: {
        type: String, 
        enum: ['active', 'inactive'],
        default: "inactive"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    autoCreate: true, 
    autoIndex: true, 
    timestamps: true
})

const CategoryModel = mongoose.model("Category", CategorySchema)
module.exports = CategoryModel;
