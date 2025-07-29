const express = require('express');
const router = express.Router();
const URL = require('../models/url');


// Serve static files from the 'public' directory


router.get('/',async (req,res)=>{
  const allUsers = await URL.find({});
   return res.render('home',{
      urls :allUsers,
      name :'jeel'
   });
})

router.get('/signup',(req,res)=>{
   return res.render("signup");
})

router.get('/loginup',(req,res)=>{
   return res.render("loginup");
})


module.exports = router;