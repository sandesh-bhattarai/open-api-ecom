require("dotenv").config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_NAME, 
    autoCreate: true, 
    autoIndex: true
}).then((sucess) => {
    console.log("Db Server connected...")
}).catch((exception) => {
    console.log("Error establishing db connection...")
    process.exit(1)
})