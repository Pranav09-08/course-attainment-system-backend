const bcrypt = require ("bcrypt")
const jwt = require ("jsonwebtoken")
const User = require("../models/login_user")

const loginController = {
    login : async(req,res)=>{
        try{
            const {email,password} = req.body; // to take the inputs from the user

            //Validate of inputs
            if(!email || !password)
            {
                return res.send("Email and Password are required.");
            }

            //to find the user using email
            const user = await User.findByEmail(email);
            if(!user)
            {
                return res.status(404).send("User not found");
            }

           
            // Compare the plain text password
      if (password !== user.password) {
        return res.status(401).send("Invalid credentials.");
      }

            res.json({ message: "Login Successful" });
        }
        catch(err)
        {
            console.error(err);
            res.status(500).send("Server error");
        }
    }
};

module.exports = loginController