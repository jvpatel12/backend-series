const express =  require('express');
const getRouter = express.Router();

getRouter.get("/contact-deatils",(req,res,next)=>{
   console.log("handling /contact-us for GET",req.url,req.method);
   
    res.send(`
         <form action="/contact-deatils" method ="POST">
           <input type="email" id="email"  required />
           <input type="text" id="name" required />
           <input type="submit" placeholder="submit"/>
         </form>
      
        `)

    
});

module.exports = getRouter;
