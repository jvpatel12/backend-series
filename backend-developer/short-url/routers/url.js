const express  = require('express');
const router =  express.Router();
const { handleGenerateNewShortURL } = require('../controllers/url');
//const { restrictToLoggedinUserOnly } = require('../middlerware/auth')




router.post("/", handleGenerateNewShortURL);
//router.get("/analytics/:shortId",restrictToLoggedinUserOnly)


module.exports = router;