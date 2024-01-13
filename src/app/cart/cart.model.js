const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Order", 
        default: null
    },
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    detail: {
        title: String, 
        price: Number, 
        image: String
    },
    qty: {
        type: Number, 
        require: true, 
        min: 1
    },
    rate: {
        type: Number, 
        require: true, 
        min: 1
    },
    amount: {
        type: Number, 
        require: true, 
        min: 1
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: false
    },
    status: {
        type: String, 
        enum:  ['new', 'verified', 'cancelled', 'completed'],
        default: "new"
    }
}, {
    autoIndex: true, 
    timestamps: true, 
    autoCreate: true
})

const CartModel = mongoose.model("Cart", CartSchema)
module.exports = CartModel;