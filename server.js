

const server = require('./src/app');
require("dotenv").config();

server.listen(process.env.PORT,()=>{
    console.log("server is runnig the 3000 port")
})