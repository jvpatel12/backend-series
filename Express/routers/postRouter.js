const express = require('express');
const postRouter = express.Router();


postRouter.post("/contact-deatils",(req,res,next)=>{
  
     res.send("authentication is okay");
    
});

module.exports = postRouter;