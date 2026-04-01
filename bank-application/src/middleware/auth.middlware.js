const userModel = require("../model/user.model");
const blacklistModel = require("../model/blacklist.model");

const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
        message : "Unauthorized access token is missing"
    });
  }

  try {
       
     const decode  = jwt.verify(token,process.env.TOKEN_ACCESS);

     // Check if token is blacklisted
     const isBlacklisted = await blacklistModel.findOne({ token });
     if (isBlacklisted) {
       return res.status(401).json({
         message: "Unauthorized access token has been revoked"
       });
     }

     const user = await userModel.findById(decode.userId);
     req.user = user;
     req.token = token;
     next();

  } catch (error) {
     return res.status(401).json({
        message:"Unauthorized access token is invalid"
     })
  }
}

async function authSystemUserMiddleware(req,res,next){
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
      if(!token){
         return res.status(401).json({
            message:"Unauthorized access token is missing"
         })
      }
      try {
         const decode = jwt.verify(token,process.env.TOKEN_ACCESS);
         
         // Check if token is blacklisted
         const isBlacklisted = await blacklistModel.findOne({ token });
         if (isBlacklisted) {
           return res.status(401).json({
             message: "Unauthorized access token has been revoked"
           });
         }
         
         const user = await userModel.findById(decode.userId).select("+systemUser");


         if(!user || !user.systemUser){
            return res.status(403).json({
                message:"Forbidden access you are not system user"
            })
         }
         req.user = user;
         req.token = token;
         next();
      } catch (error) {
         return res.status(401).json({
            message:"Unauthorized access token is invalid"
         })
      }

}
module.exports = {
    authMiddleware ,
    authSystemUserMiddleware
}