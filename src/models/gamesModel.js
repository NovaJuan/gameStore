const {Schema,model} = require('mongoose');

const gameSchema = new Schema({
    title:{type:String,required:true},
    description:{type: String,required:true},
    author:{type: String,required:true},
    image:{
        filename:{type: String,required:true},
        path: {type: String,required:true},
        uri: {type: String,required:true}
    },
    createdAt:{type:Date,default:Date.now()}
})
module.exports = model('games',gameSchema);