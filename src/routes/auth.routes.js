const express = require('express');
const authController = require('../controller/auth.controller')
const { authMiddleware } = require('../middleware/auth.middlware');
const route = express.Router();

route.post('/register',authController.register);
route.post('/login',authController.loginUser);
route.get('/user',authMiddleware,authController.getUser);
route.post('/logout',authMiddleware,authController.logout);
module.exports = route;

