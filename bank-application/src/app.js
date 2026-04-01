const express = require("express");
const dns = require('dns')
const connctDb = require('./config/db');
const userRoute = require('./routes/auth.routes');
const cookieParser = require("cookie-parser");
const accountRoute  = require('./routes/account.routes');
const transactionRoutes = require('./routes/transcation.routes')
// Set DNS servers BEFORE connecting to MongoDB
dns.setServers(["1.1.1.1","8.8.8.8"])

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/user',userRoute);
app.use('/api/account',accountRoute);
app.use('/api/transaction',transactionRoutes)
connctDb();

module.exports = app;