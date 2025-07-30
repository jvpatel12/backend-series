const express  = require('express');
const mongoose = require('mongoose');
const user = require('./models/user.model');
const path = require('path');
const e = require('express');



const app = express();
const PORT =  3000;

app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs');


app.get('/', (req, res) => {
    res.render('index');    
}
);

app.get('/read',async (req,res)=>{
   let users = await user.find();
   res.render('read', { users });
})


app.post('/create', async (req, res) => {
    const { name, email, image } = req.body;
    const data = await user.create({
        name,
        email,
        image
    });
    res.send(data);
}
);

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;  
    const data = await user.deleteOne({ _id: id });
    res.redirect('/read');}
);
app.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    const data = await user.updateOne({ _id: id }, { name: 'Updated Name' });
   res.redirect('/read'); // Redirect to the read page after update
}
);
// Uncomment the following lines to test CRUD operations    


// app.get('/users', async (req, res) => {
//      const data = await user.create({
//         name:'patel jeel',
//         email:'jvpatel232@gmail.com',
//         password:'1234567'
//      });
//         res.send(data);
     
// });


// app.get('/update', async (req, res) => {
//      const data = await user.updateOne({name:'patel jeel'}, {name:'jeel patel'});
//      res.send(data);
     
// });

// app.get('/read', async (req, res) => {
//      const data = await user.find();
//      res.send(data);
     
// });

// app.get('/delete', async (req, res) => {
//      const data = await user.deleteOne({name:'patel jeel'});          
//         res.send(data);
// });




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);


