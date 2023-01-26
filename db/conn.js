const mongoose = require("mongoose");

// const DB = process.env.DATABASE;
const DB= 'mongodb+srv://admin:admin@cluster0.sobdjaj.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("connection is successfully done")).catch((error)=>console.log("pls read the error and fix it" + error.message))