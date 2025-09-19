const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const userControllers = {
    getUser: async(req,res) => {
        try {
            const user = await User.findById(req.params.id).select("-password");
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    //Get All User
    getAllUser: async(req,res) =>{
        try {
            const user = await User.find().select("-password");
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteUser: async(req,res) =>{
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json("Delete success fully")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    updateUser: async(req,res) =>{
        try {
            const user = await User.findById(req.params.id);
            if(!await User.findOne({email: req.body.email})){
                if(!await User.findOne({phone: req.body.phone})){
                    if(req.body.password){
                        const salt = await bcrypt.genSalt(10);
                        const hashed = await bcrypt.hash(req.body.password, salt);
                        await user.updateOne({
                            email: req.body.email,
                            password: hashed,
                            image:req.body.image,
                            fullname:req.body.fullname,
                            phone:req.body.phone,
                            birth:req.body.birth,
                            gender:req.body.gender,                
                            address: req.body.address,
                            dowloaded:req.body.dowloaded,
                            admin:req.body.admin,
                            blogger:req.body.blogger,
                        });
                        res.status(200).json("Update successfully");
                    } else {
                        await user.updateOne({$set: req.body});
                        res.status(200).json("Update successfully");
                    }
                } else res.status(400).json("Phone number already exists!");
            } else res.status(400).json("Email already exists!");
        } catch (error) {
            res.status(500).json(error);
        }
    },
}
module.exports = userControllers;