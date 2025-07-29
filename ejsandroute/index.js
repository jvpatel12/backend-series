const express = require('express');

const app =express();

const path  = require('path');
const ejs = require('ejs');
const { log } = require('console');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/about/:jeel',(req,res) => {
  res.send(`welcome,${req.params.jeel}`);
})

app.listen(3000,()=>{
    log('Server is running on port 3000');
})