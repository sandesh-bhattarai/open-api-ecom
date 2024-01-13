const mongoose = require("mongoose")
// User
// type: String, Number, Array, Object, ObjectId, Date, 
const UserSchemaDef = new mongoose.Schema({
    name: {
        type: String,  
        required: true, 
        min: 2, 
        max: 50
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String,
        default: null
    },
    status: {
        type: String, 
        enum: ["active",'inactive'],
        default: "inactive"
    },
    image: String,
    address: {
        shipping: {
            type: String
            // state: {
            //     type: mongoose.Types.ObjectId,
            //     ref: "State"
            // },
            // district: {},
            // localBody: {},
            // wardNo:{},
            // data: {}
        },
        billing: {
            type: String
            // state: {},
            // district: {},
            // localBody: {},
            // wardNo:{},
            // data: {}
        }
    },
    role: {
        type: String,
        enum: ['admin','seller','customer'],
        default: "customer"
    },
    phone: String,
    token: String,
    resetToken: String,
    resetExpiry: Date
    // lang: enum[np,en], default: en
}, {
    // createdAt, updatedAt  // +
    timestamps: true ,
    autoCreate: true, 
    autoIndex: true
});

// const StateModel = mongoose.model("State")
const UserModel = mongoose.model("User", UserSchemaDef);
module.exports = UserModel;