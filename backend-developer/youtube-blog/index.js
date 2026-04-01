const express  = require('express');
const path  = require('path');

const userRoute = require('./routers/user')
const app = express();

const PORT  = 8003;

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.get("/",(req,res)=>{
    res.render('home');
})

app.use('/user',userRoute);

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`);
    
})

