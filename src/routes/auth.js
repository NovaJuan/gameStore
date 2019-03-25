const {Router} = require('express');
const router = Router();
const uuid = require('uuid');

const Users = require('../models/usersModel');
const Session = require('../models/sessionModel');



createSession = async (user,req,res)=>{
    const token = uuid();
    const verifyingSession = await Session.find({sessionToken:token});
    if(verifyingSession.length == 0){
        const newSession = new Session({
            email:user.email,
            username:user.username,
            sessionToken:token
        });
        await newSession.save();
        res.cookie('token',token,{ maxAge:1000*60*30});
        res.json({status:'session created'});
    }else{
        createSession(user);
    }
}

authSession = async(req,res,next)=>{
    const {token} = req.cookies;
    const existSession = await Session.find({sessionToken:token});
    if(existSession.length > 0){
        next();
    } else{
        res.json({error:'user not authenticated'});
        return;
    }
}

onSession = async(req,res,next)=>{
    const {token} = req.cookies;
    const existSession = await Session.find({sessionToken:token});
    if(existSession.length == 0){
        next()
    } else{
        res.json({status:'user authenticated'})
        return
    }
}




router.post('/signup',onSession,async(req,res)=>{
    const {email,username,password} = req.body;

    const verifyingEmail = await Users.find({email:email});
    const verifyingUsername = await Users.find({username:username});

    const errors = [];

    if(email == ''){
        errors.push('Please enter a email');
    }else{
        if(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)){
            if(verifyingEmail.length > 0){
                errors.push('That email already exist');
            }
        }else{
            errors.push('Please enter a valid email');
        }
    }

    if(username == ''){
        errors.push('Please enter a username');
    }else{
        if(verifyingUsername.length > 0){
            errors.push('That username already exist');
        }
    }

    if(password == ''){
        errors.push('Please enter a password');
    }

    if(errors.length > 0){
        res.json({errors});
    }else{
        const newUser = new Users({
            email,
            username,
            password
        });

        await newUser.save();

        res.json({status:'User Created'});
    }
});

router.post('/login',onSession,async(req,res)=>{
    let errors = [];
    const {email,password} = req.body;

    if(email !=''){
        const verifyingUser = await Users.find({email:email});
        if(verifyingUser.length > 0){
            const user = verifyingUser[0];
            if(user.password == password){
                createSession(user,req,res);
            }else{
                errors.push('Password incorrect');
            }
        }else{
            errors.push("That user doesn't exists");
        }
    }else{
        errors.push('Please enter your account');
    }

    if(errors.length > 0){
        res.json({errors});
    }
});

router.get('/user',authSession,async(req,res)=>{
    const {token} = req.cookies;
    const data = await Session.find({sessionToken:token});
    const userInfo = {username: data[0].username,email:data[0].email}; 
    res.json(userInfo);
});
router.get('/logout',authSession,async(req,res)=>{
    const {token} = req.cookies;
    await Session.deleteOne({sessionToken:token});
    res.clearCookie('token');
    res.json({status:'logged out'});
});



module.exports = router;