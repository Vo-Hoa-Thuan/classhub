const jwt = require('jsonwebtoken')
const RefreshTokenService = require('../services/refreshTokenService')

const middlewareControllers = {
    //verify token
    vertifyToken: async (req,res,next) =>{
        try {
            // Check both Authorization and token headers
            const authHeader = req.headers.authorization;
            const tokenHeader = req.headers.token;
            
            console.log('vertifyToken: authHeader:', authHeader);
            console.log('vertifyToken: tokenHeader:', tokenHeader);
            
            let token = null;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader;
            } else if (tokenHeader) {
                token = tokenHeader;
            }
            
            console.log('vertifyToken: extracted token:', token);
            
            if(!token){
                console.log('vertifyToken: No token found');
                return res.status(401).json({
                    success: false,
                    message: "Access token is required"
                });
            }

            const accessToken = token.split(" ")[1];
            console.log('vertifyToken: accessToken:', accessToken);
            if(!accessToken){
                console.log('vertifyToken: Invalid token format');
                return res.status(401).json({
                    success: false,
                    message: "Invalid token format"
                });
            }

            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY || 'HJAWJBFUAHWUFHUANWDUNWAUXCNAWHJAWJBFUAHWUFHUANWDUNWAUXCNAW', (err, user) => {
                if(err){
                    return res.status(403).json({
                        success: false,
                        message: "Token is not valid or expired"
                    });
                }
                
                // Check if token type is access token
                if(user.type !== 'access'){
                    return res.status(403).json({
                        success: false,
                        message: "Invalid token type"
                    });
                }
                
                req.user = user;
                next();
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Token verification failed"
            });
        }
    }, 
    //verify token admin
    vertifyTokenAdmin: (req,res,next) =>{
       middlewareControllers.vertifyToken(req,res,()=>{
        if(req.user.admin){
            next()
        }
        else{
            res.status(403).json({
                success: false,
                message: "Admin access required"
            })
        }
       })
    },  
    //verify token adminBlogger
    vertifyTokenAdminBlogger: (req,res,next) =>{
        middlewareControllers.vertifyToken(req,res,()=>{
         if(req.user.role === 'adminBlogger' || req.user.admin==true){
             next()
         }
         else{
            res.status(403).json({
                success: false,
                message: "Admin Blogger or admin access required"
            })
         }
        })
     },
    //verify token product manager
    vertifyTokenProductManager: (req,res,next) =>{
        middlewareControllers.vertifyToken(req,res,()=>{
         if(req.user.productManager==true || req.user.admin==true){
             next()
         }
         else{
             res.status(403).json({
                 success: false,
                 message: "Product Manager or admin access required"
             })
         }
        })
     },  
    //verify token - check token
    checkToken: (req,res) =>{
        // Check both Authorization and token headers
        const authHeader = req.headers.authorization;
        const tokenHeader = req.headers.token;
        
        let token = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader;
        } else if (tokenHeader) {
            token = tokenHeader;
        }
        
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY || 'HJAWJBFUAHWUFHUANWDUNWAUXCNAWHJAWJBFUAHWUFHUANWDUNWAUXCNAW',(err,user)=>{
                if(err){
                   return res.status(403).json({
                       success: false,
                       message: "Token is not valid"
                   })
                }
                else{
                    req.user = user;
                    return res.status(200).json({
                        success: true,
                        message: "Valid token"
                    })
                }
            })
        } else {
           return res.status(401).json({
               success: false,
               message: "Access token is required"
           })
        }
    }, 
    //check token admin
    checkTokenAdmin: (req,res) =>{
        middlewareControllers.vertifyToken(req,res,()=>{
         if(req.user.admin=== true){
            res.status(200).json({
                success: true,
                message: "Valid admin token"
            })
         }
         else{
             res.status(401).json({
                 success: false,
                 message: "Admin access required"
             })
         }
        })
     }, 
}

module.exports = middlewareControllers;