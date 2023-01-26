const express = require("express");
const router = new express.Router();
const products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate = require("../middleware/authenticate");




router.get("/getproducts", async (req, res) => {
    try {
        
        const producstdata = await products.find();
        res.status(201).json(producstdata);
    } catch (error) {
        res.status(401).send("ishwar Something went wrong")
    }
});


// register the data

router.post("/register", async (req, res) => {
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: " ishwar fill all  details" });
        
    };
    try {
        const preuser = await User.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "ishwar This email  already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: " ishwar password dosent match" });;
        } else {

            const finaluser = new User({
                fname, email, mobile, password, cpassword
            });

            // Hashing to be done here
            const storedata = await finaluser.save();
            res.status(201).json(storedata);
        }

    } catch (error) {
        res.status(422).send(error);
    }

});



// login data

router.post("/login", async (req, res) => {
   
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "ishwar fill the details" });
    }
    try {
        const userlogin = await User.findOne({ email: email });
        console.log(userlogin);
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            
            if (!isMatch) {
                res.status(400).json({ error: "ishwar invalid crediential pass" });
            } else {
                userlogin.loggedin=true;
                await userlogin.save()
                res.status(201).json(userlogin);
            }
        } else {
            res.status(400).json({ error: "ishwar user does not exist" });
        }
    } catch (error) { 
        res.status(400).json({ error: " ishwar invalid crediential pass" });
    }
});

// getindividual

router.get("/getproductsone/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const individual = await products.findOne({ id: id });
        res.status(201).json(individual);
    } catch (error) {
        res.status(400).json(error);
    }
});


// adding the data into cart
router.post("/addcart/:email/:id", async (req, res) => {
        
    try {
       
        const { id, email } = req.params;
        const cart = await products.findOne({ id: id });
        const Usercontact = await User.findOne({ email: email })
        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);
            await Usercontact.save();
            res.status(201).json(Usercontact);
        }
    } catch (error) {
        console.log(error);
        res.status(401).send("ishwar error from addcart")
    }
});


// get data into the cart
router.get("/cartdetails/:email", async (req, res) => {
    const {email} = req.params
    try {
        const buyuser = await User.findOne({ email:email});
        res.status(201).json(buyuser);
    } catch (error) {
        res.status(401).send("error from cart details")
    }
});





// for userlogout

router.get("/logout/:email",  async (req, res) => {
    const {email} = req.params
    try {
        const userlogin = await User.findOne({ email: email });
        userlogin.loggedin=false
        await userlogin.save()
        res.status(200).send("successfully logged off")
    } catch (error) {
        res.status(400).send(`error from logout`)
    }
});


// remove iteam from the cart

router.get("/remove/:email/:id", async (req, res) => {
    try {
        const { id, email } = req.params;
        const user = await User.findOne({ email: email });
        
        // user.carts = user.carts.filter((curel)=>{
        //     return curel._id !=id
        // })
        let index = 0;
        
        for(  i=0; i < user.carts.length;i++){
            console.log(i,"--->",user.carts[i].id)
            if (user.carts[i]._id===id){
                index = i;
            break;            }
        }
        user.carts = user.carts.splice(index,1);
        console.log("elememt at index no  ",index)
        
        
        await user.save()
        res.status(201).json(user)

    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
});


module.exports = router;