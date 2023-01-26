require("dotenv").config();
const express = require("express");
const app = express();
// const mongoose = require("mongoose");
const port = process.env.PORT ||  8000;
const cookieParser = require("cookie-parser");
const DefaultData = require("./defaultdata");
require("./db/conn");
const router = require("./routes/router");
const products = require("./models/productsSchema");
const jwt = require("jsonwebtoken");
const cors = require('cors')


// middleware
app.use(express.json());
app.use(cookieParser(""));
app.use(cors(
    {
        origin: ["http://localhost:3000","https://admirable-sunshine-233630.netlify.app/","https://63c6ab91d289a53f83b32279--superb-granita-a136e7.netlify.app"],
        optionsSuccessStatus: 200,
        credentials: true
    }
))


app.use(router);
// app.get("/",(req,res)=>{
//     res.send("your server is running");
// });


if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
}

app.listen(port,"0.0.0.0",()=>{
    console.log(`your server is running on port ${port} `);
});

DefaultData();