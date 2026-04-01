const express   = require('express');
const getRouter = require('./routers/getRouter');
const postRouter = require('./routers/postRouter');
const app  =express();

app.use(express.urlencoded());
app.use(getRouter);
app.use(postRouter);





app.listen(3000,()=>{
    console.log("app is listen to",3000);
})