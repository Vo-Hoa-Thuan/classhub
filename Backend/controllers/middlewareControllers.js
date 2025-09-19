const jwt = require('jsonwebtoken')

const middlewareControllers = {
    //verify token
    vertifyToken: (req,res,next) =>{
        const token = req.headers.token;
        if(token){
            // const accessToken = token.split("")[1];
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.MY_ACCESS_KEY,(err,user)=>{
                if(err){
                   return res.status(403).json("Token is not valid")
                }
                else{
                    req.user = user;
                    next();
                }
            })
        } else {
           return res.status(401).json("You're not authentication")
        }
    }, 
    //verify token admin
    vertifyTokenAdmin: (req,res,next) =>{
       middlewareControllers.vertifyToken(req,res,()=>{
        if(req.user.admin){
            next()
        }
        else{
            res.status(403).json("You're not have access!")
        }
       })
    },  
    //verify token blogger
    vertifyTokenBlogger: (req,res,next) =>{
        middlewareControllers.vertifyToken(req,res,()=>{
         if(req.user.blogger==true || req.user.admin==true){
             next()
         }
         else{
             res.status(403).json("You're not have access")
         }
        })
     },  
    //verify token - check token
    checkToken: (req,res) =>{
        const token = req.headers.token;
        if(token){
            // const accessToken = token.split("")[1];
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.MY_ACCESS_KEY,(err,user)=>{
                if(err){
                   return res.status(403).json("Token is not valid")
                }
                else{
                    req.user = user;
                    return res.status(200).json("Valid token")
                }
            })
        } else {
           return res.status(401).json("You're not authentication")
        }
    }, 
    //check token admin
    checkTokenAdmin: (req,res) =>{
        middlewareControllers.vertifyToken(req,res,()=>{
         if(req.user.admin=== true){
            res.status(200).json("Valid admin token")
         }
         else{
             res.status(401).json("You're not have access!")
         }
        })
     }, 
}

module.exports = middlewareControllers;