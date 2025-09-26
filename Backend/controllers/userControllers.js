const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userControllers = {
    getUser: async(req,res,next) => {
        try {
            const user = await User.findById(req.params.id).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },
    //Get All User
    getAllUser: async(req,res,next) =>{
        try {
            const users = await User.find().select("-password");
            res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async(req,res,next) =>{
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    },
    updateUser: async(req,res,next) =>{
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Check for duplicate email (excluding current user)
            if (req.body.email && req.body.email !== user.email) {
                const existingUser = await User.findOne({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }
            }

            // Check for duplicate phone (excluding current user)
            if (req.body.phone && req.body.phone !== user.phone) {
                const existingUser = await User.findOne({ phone: req.body.phone });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "Phone number already exists"
                    });
                }
            }

            // Prepare update data
            const updateData = { ...req.body };
            
            // Hash password if provided
            if (req.body.password) {
                const salt = await bcrypt.genSalt(12);
                updateData.password = await bcrypt.hash(req.body.password, salt);
            }

            // Remove confirmPassword from update data
            delete updateData.confirmPassword;
            
            const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { 
                new: true,
                runValidators: true 
            }).select("-password");

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    },
}
module.exports = userControllers;