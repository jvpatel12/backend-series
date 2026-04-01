const express = require('express');
const auth = require('../middleware/auth.middlware')
const accountController = require('../controller/account.controller')

const router = express.Router();

// post /api/account/create
// create new account
// protected Routes
router.post('/create', auth.authMiddleware, accountController.createAccount);

// get /api/account/user
// get account for logged in user
// protected Routes
router.get('/user', auth.authMiddleware, accountController.getAccount);

// get /api/account/all
// get all accounts for logged in user
// protected Routes
router.get('/all', auth.authMiddleware, accountController.getAllAccounts);

module.exports = router;