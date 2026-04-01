const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const userModel   = require("./models/user");
const path  = require('path');
const { emit } = require('process');
const { log } = require('console');
const mongoose = require('mongoose');



app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());




// app.get('/',(req,res)=>{
//       res.cookie("name","jeel");  //set the cookie 
//       res.send("done");
// })




// app.get('/bcrypt',(req,res)=>{
//     bcrypt.genSalt(10,function(err,salt){
//            bcrypt.hash("jeelpatel",salt,function(err,hash){
//             console.log(hash);
            
//            })
//     })
// })

// const hash= '$2b$10$VP7Mno7Rf5XvUVuOfAJm2OYQg3eDZ33mN4hL7Tz1CxnbcZ/6FFrsO';

// app.get('/compare',(req,res)=>{
    
//            bcrypt.compare("jeelpatel",hash,function(err,result){
//             console.log(result);
            
//            })
    
// })



// app.get('/jwt',(req,res)=>{
//     const token  = jwt.sign({email:'jeelpatel@example.com'},'secret');
//     res.cookie("token",token);
//     console.log(token);
//     res.send("jsontwebtoken");
    
// })

// app.get('/read',(req,res)=>{
//     console.log(req.cookies.token);// get the cookies value
//     res.send("read-page");
// })


app.get('/',(req,res)=>{
    res.render('index');
})

app.post('/create', (req,res)=>{
    
          const {username , email,password,age} = req.body;


           bcrypt.genSalt(10,function(err,salt){
            
            bcrypt.hash(password,salt,async(err,hash)=>{
          const  createdUser  = await userModel.create({
        username ,
         email,
         password:hash,
         age
    })   

    let token   = jwt.sign({email},"shhhhhhh");
    res.cookie("token",token);
   
           })
            res.send(createdUser);
           })

})

app.post('/login',async function(req,res){
    let user = await userModel.findOne({email:req.body.email});
    if(!user) return res.send("somthing is wrong");


     bcrypt.compare(req.body.password,user.password,function(err,result){
       
     if(result) res.send("yes ypur login");
        else res.send("something is wrong");
})

})

app.get("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/")
})
app.listen(4005);
