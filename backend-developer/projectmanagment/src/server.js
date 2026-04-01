import dotenv from 'dotenv';
import express from 'express';
import app from'./app.js';
import connectDB from './db/db.js';


dotenv.config({
    path: './.env',
    override: true,
});


const port = process.env.PORT || 3000;

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log("example app listing o port ",port);
        
    })
}).catch((err)=>{
    console.error("connection to db failed",err);
    process.exit(1);
})




