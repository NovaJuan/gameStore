const {Router} = require('express');
const fs = require('fs-extra');
const router = Router();
const path = require('path');

const Game = require('../models/gamesModel');
const Session = require('../models/sessionModel');

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

router.use(authSession);

router.get('/',async (req,res)=>{
    const games = await Game.find();
    res.json(games);
});

router.post('/',async(req,res)=>{
    const {title,description,author} = req.body;
    const newGame = new Game({
        title,
        description,
        author,
        image:{
            filename:req.file.filename,
            path:req.file.path,
            uri:'/public/uploads/' + req.file.filename
        }
    });
    await newGame.save()
    res.json({status:'received'});
});


router.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    const game = await Game.findByIdAndDelete(id);
    await fs.unlink(path.resolve('./src/public/uploads/',game.image.filename));
    res.json({status:'game deleted'});
});

module.exports = router;