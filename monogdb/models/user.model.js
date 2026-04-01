// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/mydatabase');

// const userSchema =  mongoose.Schema({
  
//     name:String,
//     email: String,
//     password: String,


// });
//   module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase');

const userSchema =  mongoose.Schema({
  
    name:String,
    email: String,
    image: String, // Use Mixed type for image to allow various formats
});
  module.exports = mongoose.model('User', userSchema);