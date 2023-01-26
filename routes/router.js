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
        console.log("error" + error.message);
        res.status(401).send("ishwar Something went wrong")
    }
});


// register the data
router.post("/register", async (req, res) => {
    // console.log(req.body);
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
            // console.log(storedata + "user successfully added");
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("ishwar some error while registering" + error.message);
        res.status(422).send(error);
    }

});



// login data
router.post("/login", async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "ishwar fill the details" });
    }

    try {

        const userlogin = await User.findOne({ email: email });
        console.log(userlogin);
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            console.log(isMatch);



            if (!isMatch) {
                res.status(400).json({ error: "ishwar invalid crediential pass" });
            } else {
                
                // const token = await userlogin.generatAuthtoken();
                // console.log(token);

                // res.cookie("eccomerce", token, {
                //     expires: new Date(Date.now() + 2589000),
                //     httpOnly: true
                // });
                console.log("ishwar this is user login data",userlogin)
                userlogin.loggedin=true;
                await userlogin.save()
                console.log("login status gettinh here ", userlogin.islogin)
                res.status(201).json(userlogin);
            }

        } else {
            res.status(400).json({ error: "ishwar user does not exist" });
        }

    } catch (error) { 
        console.log("ishwar there is some error duru=ing login" + error.message);
        res.status(400).json({ error: " ishwar invalid crediential pass" });
       
    }
});

// getindividual

router.get("/getproductsone/:id", async (req, res) => {

    try {
        const { id } = req.params;
        console.log(id);

        const individual = await products.findOne({ id: id });
        console.log(individual + "ind mila hai");

        res.status(201).json(individual);
    } catch (error) {
        res.status(400).json(error);
    }
});


// adding the data into cart
router.post("/addcart/:email/:id", async (req, res) => {
        
    try {
        // console.log("perfect 6");
        const { id, email } = req.params;
        const cart = await products.findOne({ id: id });
        // console.log(cart + "cart milta hain");

        // const Usercontact = await User.findOne({ _id: req.userID });
       
        const Usercontact = await User.findOne({ email: email })
        // console.log(Usercontact + "user milta hain");


        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            // console.log(cartData + " thse save wait kr");
            // console.log(Usercontact + "userjode save");
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
        console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
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
        console.log("user logout");

    } catch (error) {
       
        res.status(400).send(`error from logout`)
    }
});

// item remove ho rhi hain lekin api delete use krna batter hoga
// remove iteam from the cart

router.get("/remove/:email/:id", async (req, res) => {
    try {
        const { id, email } = req.params;

        // req.rootUser.carts = req.rootUser.carts.filter((curel) => {
        //     return curel.id != id
        // });

        // req.rootUser.save();
        // res.status(201).json(req.rootUser);
        // console.log("iteam remove");


        const user = await User.findOne({ email: email });
        user.carts = user.carts.filter((curel)=>{
            return curel.id !=id
        })
        await user.save()
        res.status(201).json(user)

    } catch (error) {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});


module.exports = router;