const express = require('express');
const app = express();
const {connectToDatabase} = require('./connects/connect');
const mongoose = require('mongoose');
const urlRouter = require('./routers/url');
const shortId = require('shortid');
const path = require('path');
const  staticRouter = require('./routers/staticRouter'); 
const userRouter = require('./routers/User');
const URL = require('./models/url');
const cookieParser = require('cookie-parser');
// const { restrictToLoggedinUserOnly } = require("./middlerware/auth")



connectToDatabase('mongodb://localhost:27017/short-url').then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
});



app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));




app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // to parse URL-encoded bodies
app.use(cookieParser);


app.get('/test',async (req,res)=>{
   
  const allUsers = await URL.find({});

  return  res.render('home',{
    urls :allUsers,
    name :'jeel'
  });
});
//app.use("/url", restrictToLoggedinUserOnly ,urlRouter);
app.use('/',staticRouter);
app.use("/user",userRouter)



app.get('/:shortId',async (req,res)=>{
      const shortId = req.params.shortId;

      const entry  = await URL.findOneAndUpdate({
        shortId
      },{$push : {
        totalClicks : {
            timestamp : Date.now()
        },
      }})
      res.redirect(entry.redirectURL);
})




app.listen(8002,()=>{
   console.log('Server is running on http://localhost:8002');
});