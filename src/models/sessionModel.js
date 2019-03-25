const {model,Schema}=require('mongoose');

const SessionSchema = new Schema({
    email:{type:String},
    username:{type:String},
    sessionToken:{type:String,required:true},
    createdAt:{type:Date,default:Date.now(),expires:'30m'}
});

module.exports = model('sessions',SessionSchema);