const express = require('express');
const path =  require('path');
const ejs = require('ejs');
const { log } = require('console');
const fs = require('fs');


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    fs.readdir(`./files`,function (err,files){
   
    res.render('index', {files:files});
    })
})

app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details  ,function(err){
      res.redirect('/');    
    })
    })

app.get('/file/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,'utf-8',function(err,data){
     res.render('show',{filename:req.params.filename,content:data});    
    })
})

app.listen(3001,()=>{
    log('Server is running on port 3001');
});      