const {Router} = require('express');
const router = Router();
const path = require('path');

const Session = require('../models/sessionModel');

authSession = async(req,res,next)=>{
    const {token} = req.cookies;
    const existSession = await Session.find({sessionToken:token});
    if(existSession.length > 0){
        next()
    } else{
        res.redirect('/login');
    }
}

onSession = async(req,res,next)=>{
    const {token} = req.cookies;
    const existSession = await Session.find({sessionToken:token});
    if(existSession.length == 0){
        next()
    } else{
        res.redirect('/')
    }
}

router.get('/',authSession,(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'));
});

router.get('/login',onSession,(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'));
});

router.get('/signup',onSession,(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/signup.html'));
});

module.exports = router;