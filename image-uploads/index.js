const express  = require('express');
const app =  express();
const path = require('path')
const multer  =  require('multer');
const { log } = require('console');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
   
   return  cb(null, `${file.originalname}`);
  }
})

const upload = multer({ storage: storage })


const PORT = 2000;

app.set("view engine", "ejs");
app.set("views",path.resolve(("./views")));

app.use(express.json());

app.use(express.urlencoded({extended : false}));

app.get('/',(req,res) =>{
    return res.render("index");
})

app.post('/upload',upload.single("fileImage"),(req,res) =>{
    console.log(req.body);
    console.log(req.file);
    

    return res.redirect("/");
    
})




app.listen(PORT,()=>{
    console.log("server is running in localhost of",PORT);
    
})
