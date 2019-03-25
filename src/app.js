if(process.env.NODE_ENV === 'development'){
    require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');


//initializations
const app = express();
require('./db');

//settings
app.set('port',process.env.PORT || 3000);

//middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/uploads'),
    filename: (req,file,cb) =>{
        cb(null,uuid() + Date.now() + path.extname(file.originalname));
    }
})

app.use(multer({storage}).single('image'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname,'public')));

app.use(morgan('dev'));


//routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/games',require('./routes/games'));
app.use('/',require('./routes/client'));

//Turning on the server
console.log(process.env.NODE_ENV);
app.listen(app.get('port'),()=>console.log(`Server On Port ${app.get('port')}`));