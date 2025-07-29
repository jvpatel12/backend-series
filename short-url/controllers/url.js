const shortId   = require('shortid');


const URL  = require('../models/url');
const shortid = require('shortid');




async function handleGenerateNewShortURL(req,res) {
  
    const body = req.body;

    if(!body.url) return res.status(400).json({error : "Please provide a valid URL"});
    const shortID = shortid();

    await URL.create({

        shortId : shortID,
        redirectURL : req.body.url,
        totalClicks : []
        })
        
    return res.status(201).json({id : shortID});
    
}


module.exports = {
    handleGenerateNewShortURL,
}