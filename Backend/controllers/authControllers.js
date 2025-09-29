const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const TokenService = require('../services/tokenService')
const rolePermissionService = require('../services/rolePermissionService')
const { 
    sendVerificationEmail, 
    createVerificationToken, 
    verifyEmailToken,
    checkVerificationStatus 
} = require('./emailVerificationController')

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
            console.log('🚀 [REGISTER] Starting registration process...');
            console.log('📧 [REGISTER] Email:', req.body.email);
            console.log('👤 [REGISTER] Fullname:', req.body.fullname);
            console.log('📱 [REGISTER] Phone:', req.body.phone);
            
            // Check if user already exists
            console.log('🔍 [REGISTER] Checking if user already exists...');
            const existingUser = await User.findOne({ 
                email: req.body.email
            });
            
            if (existingUser) {
                console.log('❌ [REGISTER] User already exists:', req.body.email);
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }
            console.log('✅ [REGISTER] User does not exist, proceeding...');

            // Check if there's already a pending verification for this email
            console.log('🔍 [REGISTER] Checking for existing verification...');
            const existingVerification = await checkVerificationStatus(req.body.email);
            if (existingVerification.exists) {
                console.log('⚠️ [REGISTER] Verification already exists for:', req.body.email);
                return res.status(400).json({
                    success: false,
                    message: "Email verification already sent. Please check your email or wait for the current verification to expire."
                });
            }
            console.log('✅ [REGISTER] No existing verification found');

            // Hash password with higher salt rounds
            console.log('🔐 [REGISTER] Hashing password...');
            const salt = await bcrypt.genSalt(12);
            const hashed = await bcrypt.hash(req.body.password, salt);
            console.log('✅ [REGISTER] Password hashed successfully');
            
            // Prepare user data for verification
            const userData = {
                ...req.body,
                password: hashed,
                isVerified: false
            };
            console.log('📝 [REGISTER] User data prepared for verification');
            
            // Create verification token and save user data temporarily
            console.log('🎫 [REGISTER] Creating verification token...');
            const { token } = await createVerificationToken(userData);
            console.log('✅ [REGISTER] Verification token created:', token.substring(0, 20) + '...');
            
            // Create verification URL
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
            console.log('🔗 [REGISTER] Verification URL created:', verificationUrl);
            
            // Send verification email
            console.log('📧 [REGISTER] Sending verification email...');
            await sendVerificationEmail(req.body.email, verificationUrl, req.body.fullname);
            console.log('✅ [REGISTER] Verification email sent successfully to:', req.body.email);
            
            console.log('🎉 [REGISTER] Registration completed successfully!');
            res.status(201).json({
                success: true,
                message: "Registration successful! Please check your email to verify your account. You have 15 minutes to complete verification.",
                data: {
                    email: req.body.email,
                    fullname: req.body.fullname,
                    verificationSent: true
                }
            });
        }catch(err){
            console.error('❌ [REGISTER] Registration error:', err.message);
            console.error('🔍 [REGISTER] Full error:', err);
            next(err);
        }
    },
    //LOGIN USER
    loginUser: async(req,res,next) =>{
        try{
            console.log('🔐 [LOGIN] Starting login process...');
            console.log('📧 [LOGIN] Email:', req.body.email);
            
            const user = await User.findOne({email: req.body.email});
            if(!user){
                console.log('❌ [LOGIN] User not found:', req.body.email);
               return res.status(401).json({
                   success: false,
                   message: "Invalid email or password"
               });
            }
            
            console.log('✅ [LOGIN] User found:', user.email);
            console.log('🔍 [LOGIN] User verified status:', user.isVerified);
            
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            
            if(!validPassword){
                console.log('❌ [LOGIN] Invalid password for:', req.body.email);
               return res.status(401).json({
                   success: false,
                   message: "Invalid email or password"
               });
            }
            
            console.log('✅ [LOGIN] Password is valid');
            
            // Check if user email is verified
            if (!user.isVerified) {
                console.log('⚠️ [LOGIN] User not verified:', req.body.email);
                return res.status(403).json({
                    success: false,
                    message: "Bạn cần xác nhận tài khoản để sử dụng hệ thống. Vui lòng kiểm tra email và nhấp vào liên kết xác nhận.",
                    code: "EMAIL_NOT_VERIFIED",
                    data: {
                        email: user.email,
                        isVerified: false
                    }
                });
            }
            
            console.log('✅ [LOGIN] User is verified, proceeding with login...');
            
            if (user && validPassword) {
                console.log('🎫 [LOGIN] Creating access token...');
                const accessToken = authControllers.createAccessToken(user);
                
                // Create refresh token
                console.log('🔄 [LOGIN] Creating refresh token...');
                const userAgent = req.get('User-Agent') || '';
                const ipAddress = req.ip || req.connection.remoteAddress || '';
                const refreshToken = await TokenService.createRefreshToken(
                    user._id, 
                    userAgent, 
                    ipAddress
                );
                
                const { password, ...others } = user._doc;
                console.log('🎉 [LOGIN] Login successful for:', user.email);
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
    },

    //VERIFY EMAIL
    verifyEmail: async(req,res,next) =>{
        try{
            console.log('🔐 [VERIFY] Starting email verification...');
            const { token } = req.params;
            console.log('🎫 [VERIFY] Token received:', token.substring(0, 20) + '...');
            
            if (!token) {
                console.log('❌ [VERIFY] No token provided');
                return res.status(400).json({
                    success: false,
                    message: "Verification token is required"
                });
            }
            
            console.log('🔍 [VERIFY] Verifying token...');
            const result = await verifyEmailToken(token);
            console.log('✅ [VERIFY] Email verification successful!');
            console.log('👤 [VERIFY] User created:', result.user.email);
            
            res.status(200).json({
                success: true,
                message: "Email verified successfully! You can now log in to your account.",
                data: result.user
            });
        }catch(err){
            console.error('❌ [VERIFY] Email verification failed:', err.message);
            console.error('🔍 [VERIFY] Full error:', err);
            next(err);
        }
    },

    //RESEND VERIFICATION EMAIL
    resendVerificationEmail: async(req,res,next) =>{
        try{
            console.log('📧 [RESEND] Starting resend verification email...');
            const { email } = req.body;
            console.log('📧 [RESEND] Email:', email);
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required"
                });
            }
            
            // Check if user already exists and is verified
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already verified"
                });
            }
            
            // Check if there's already a pending verification
            const existingVerification = await checkVerificationStatus(email);
            if (existingVerification.exists) {
                // If verification exists, resend the email
                console.log('📧 [RESEND] Found existing verification, resending email...');
                
                const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${existingVerification.token}`;
                const result = await sendVerificationEmail(email, verificationUrl, existingVerification.fullname);
                
                return res.status(200).json({
                    success: true,
                    message: "Verification email sent successfully. Please check your email inbox.",
                    data: {
                        email: email,
                        messageId: result.messageId
                    }
                });
            }
            
            // If user exists but not verified and no pending verification
            if (existingUser && !existingUser.isVerified) {
                console.log('📧 [RESEND] User exists but not verified, creating new verification...');
                
                // Create new verification token
                const userData = {
                    email: existingUser.email,
                    fullname: existingUser.fullname,
                    password: existingUser.password,
                    role: existingUser.role || 'user'
                };
                
                const verificationResult = await createVerificationToken(userData);
                const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationResult.token}`;
                
                // Send verification email
                const emailResult = await sendVerificationEmail(email, verificationUrl, userData.fullname);
                
                // Delete the unverified user
                await User.deleteOne({ _id: existingUser._id });
                
                return res.status(200).json({
                    success: true,
                    message: "Verification email sent successfully. Please check your email inbox.",
                    data: {
                        email: email,
                        messageId: emailResult.messageId
                    }
                });
            }
            
            return res.status(400).json({
                success: false,
                message: "No pending registration found for this email. Please register again."
            });
        }catch(err){
            console.error('❌ [RESEND] Error:', err.message);
            next(err);
        }
    }
}

module.exports = authControllers;