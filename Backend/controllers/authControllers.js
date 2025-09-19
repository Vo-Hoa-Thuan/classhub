const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const authControllers = {

    //Create Access Token
    createAccessToken: (user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin,
            blogger: user.blogger,
        },
        process.env.MY_ACCESS_KEY,
        {expiresIn: "4h"}
        )
    },
    //REGISTER USER
    registerUser: async(req,res) =>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        //CREATE NEW USER
        const newUser = await new User (req.body);
        newUser.password = hashed;
        //Save to DB
        const user = await newUser.save()
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
    },
    //LOGIN USER
    loginUser: async(req,res) =>{
        try{
            const user = await User.findOne({email: req.body.email});
            if(!user){
               return res.status(404).json("Wrong email");
            }
            const validPasword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validPasword){
               return res.status(400).json("Wrong password")
            }
            if (user && validPasword) {
                const accessToken = authControllers.createAccessToken(user);
                // localStorage.setItem('accessToken', accessToken);
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
              }
        }catch(err){
            res.status(500).json(err)
        }
    },
    //CHECK PASSWORD
    checkPassword: async(req,res) =>{
        try{
            const user = await User.findOne({email: req.body.email});
            if(!user){
               return res.status(404).json("Wrong email");
            }
            const validPasword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validPasword){
               return res.status(400).json("Wrong password")
            }
            if (user && validPasword) {
                res.status(200).json('Correct Password');
              }
        }catch(err){
            res.status(500).json(err)
        }
    },
    //LOGOUT
    logoutUser: async(req,res)=>{
        res.status(200).json("Logged out !");
    }
}

module.exports = authControllers;