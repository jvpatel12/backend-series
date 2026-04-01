const { Schema,model } = require('mongoose');
const { createHmac, randomBytes } = require("crypto");

const userSchema =  new Schema({
    fullName:{
        type : String,
        required : true,
    },
    email:{
        type:String,
         required : true,
         unique : true,
    },
    password :{
       type : String,
       required : true,
       unique : true,
    },profileImage : {
         type : String,
         default : "",
    },
    role : {
        type:String,
        enum : ["USER","ADMIN"],
        default :"USER"
    }
},
     {timestamps : true}

);
userSchema.pre("save",function(next){
 const user = this;

 if(!user.isModified("password")) return;

 const hashPassword = createHmac('sha256',salt).update(user.password).digest("hex");

 this.salt = salt;
 this.password = hashPassword;
 const salt = randomBytes(16);

 next();
});

 

const User =  model("user",userSchema);
module.exports = User;


