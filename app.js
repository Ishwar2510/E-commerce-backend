require("dotenv").config();
const express = require("express");
const app = express();
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
        origin: ["http://localhost:3000","https://celebrated-brigadeiros-0dd5a4.netlify.app"],
        optionsSuccessStatus: 200,
        credentials: true
    }
))
app.use(router);


if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
}

app.listen(port,"0.0.0.0",()=>{
    console.log(`your server is running on port ${port} `);
});

// DefaultData();