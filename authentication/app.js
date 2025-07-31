const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');







app.use(cookieParser());
app.get('/',(req,res)=>{
      res.cookie("name","jeel");  //set the cookie 
      res.send("done");
})




app.get('/bcrypt',(req,res)=>{
    bcrypt.genSalt(10,function(err,salt){
           bcrypt.hash("jeelpatel",salt,function(err,hash){
            console.log(hash);
            
           })
    })
})

const hash= '$2b$10$VP7Mno7Rf5XvUVuOfAJm2OYQg3eDZ33mN4hL7Tz1CxnbcZ/6FFrsO';

app.get('/compare',(req,res)=>{
    
           bcrypt.compare("jeelpatel",hash,function(err,result){
            console.log(result);
            
           })
    
})



app.get('/jwt',(req,res)=>{
    const token  = jwt.sign({email:'jeelpatel@example.com'},'secret');
    res.cookie("token",token);
    console.log(token);
    res.send("jsontwebtoken");
    
})

app.get('/read',(req,res)=>{
    console.log(req.cookies.token);// get the cookies value
    res.send("read-page");
})
app.listen(4005);