const express = require('express')
const app = express();

const EventEmitter  = require("node:events")
const myEvent = new EventEmitter()
app.use((req, res, next) => {
    req.myEvent = myEvent
    next()
})
myEvent.on("eventName",(data)=> {
    console.log("Event: ", data)
})

module.exports = app;