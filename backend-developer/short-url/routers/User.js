const express = require('express');
const router  = express.Router();
const {handleUserSignup, handleUserLoginup } = require('../controllers/user');

router.post("/" , handleUserSignup)
router.post("/login",handleUserLoginup)

module.exports = router;