const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const TokenService = require('../services/tokenService')
const rolePermissionService = require('../services/rolePermissionService')

const authControllers = {

    //Create Access Token
    createAccessToken: (user)=>{
        return jwt.sign({
            id: user.id,
            role: user.role,
            permissions: user.permissions,
            // Legacy fields for backward compatibility
            admin: user.admin,
            blogger: user.blogger,
            type: 'access'
        },
        process.env.JWT_ACCESS_KEY || 'HJAWJBFUAHWUFHUANWDUNWAUXCNAWHJAWJBFUAHWUFHUANWDUNWAUXCNAW',
        {expiresIn: "15m"} // Reduced to 15 minutes for better security
        )
    },
    //REGISTER USER
    registerUser: async(req,res,next) =>{
        try{
            // Check if user already exists
            const existingUser = await User.findOne({ 
                email: req.body.email
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            // Hash password with higher salt rounds
            const salt = await bcrypt.genSalt(12);
            const hashed = await bcrypt.hash(req.body.password, salt);
            
            //CREATE NEW USER
            const newUser = new User({
                ...req.body,
                password: hashed
            });
            
            //Save to DB
            const user = await newUser.save();
            
            // Remove password from response
            const { password, ...userWithoutPassword } = user._doc;
            
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: userWithoutPassword
            });
        }catch(err){
            next(err);
        }
    },
    //LOGIN USER
    loginUser: async(req,res,next) =>{
        try{
            const user = await User.findOne({email: req.body.email});
            if(!user){
               return res.status(401).json({
                   success: false,
                   message: "Invalid email or password"
               });
            }
            
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            
            if(!validPassword){
               return res.status(401).json({
                   success: false,
                   message: "Invalid email or password"
               });
            }
            
            if (user && validPassword) {
                const accessToken = authControllers.createAccessToken(user);
                
                // Create refresh token
                const userAgent = req.get('User-Agent') || '';
                const ipAddress = req.ip || req.connection.remoteAddress || '';
                const refreshToken = await TokenService.createRefreshToken(
                    user._id, 
                    userAgent, 
                    ipAddress
                );
                
                const { password, ...others } = user._doc;
                res.status(200).json({ 
                    success: true,
                    message: "Login successful",
                    data: { 
                        ...others, 
                        accessToken,
                        refreshToken: refreshToken.token,
                        expiresIn: 15 * 60 // 15 minutes in seconds
                    }
                });
            }
        }catch(err){
            next(err);
        }
    },
    //CHECK PASSWORD
    checkPassword: async(req,res,next) =>{
        try{
            const user = await User.findOne({email: req.body.email});
            if(!user){
               return res.status(401).json({
                   success: false,
                   message: "Invalid email or password"
               });
            }
            
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            
            if(!validPassword){
               return res.status(401).json({
                   success: false,
                   message: "Invalid email or password"
               });
            }
            
            if (user && validPassword) {
                res.status(200).json({
                    success: true,
                    message: "Password is correct"
                });
            }
        }catch(err){
            next(err);
        }
    },
    //REFRESH TOKEN
    refreshToken: async(req, res, next) => {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: "Refresh token is required"
                });
            }

            const { accessToken, user } = await TokenService.refreshAccessToken(refreshToken);
            const { password, ...userWithoutPassword } = user._doc;
            
            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: {
                    accessToken,
                    user: userWithoutPassword,
                    expiresIn: 15 * 60 // 15 minutes in seconds
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    },

    //LOGOUT
    logoutUser: async(req, res, next) => {
        try {
            const { refreshToken } = req.body;
            
            if (refreshToken) {
                await TokenService.revokeRefreshToken(refreshToken);
            }
            
            res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    },

    //LOGOUT ALL SESSIONS
    logoutAllSessions: async(req, res, next) => {
        try {
            const userId = req.user.id;
            await TokenService.revokeAllUserTokens(userId);
            
            res.status(200).json({
                success: true,
                message: "All sessions logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    },

    //GET USER SESSIONS
    getUserSessions: async(req, res, next) => {
        try {
            const userId = req.user.id;
            const sessions = await TokenService.getUserSessions(userId);
            
            res.status(200).json({
                success: true,
                message: "Sessions retrieved successfully",
                data: sessions
            });
        } catch (error) {
            next(error);
        }
    },

    //Get Current User
    getCurrentUser: async(req,res,next) =>{
        try{
            const user = await User.findById(req.user.id).select('-password');
            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            
            // Thêm thông tin permissions chi tiết
            const userWithPermissions = {
                ...user.toObject(),
                permissions: user.permissions || {}
            };
            
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                user: userWithPermissions
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = authControllers;