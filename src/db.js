const mongoose = require('mongoose');
const {connect} = mongoose;

module.exports = connect(`${process.env.DB_URI}`,{useNewUrlParser: true}).then(()=>console.log('Database ON')).catch(err =>{console.log(err)});