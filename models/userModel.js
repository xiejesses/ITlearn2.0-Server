/*
**用户模型
*/
let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let userSchema = new Schema({
    userName:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    userEmail:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    userPwd:{
        type:String,
        required:true,
        trim:true
    },
    createTime:{
        type: Date, 
        default: Date.now
    }


});

module.exports = mongoose.model('user',userSchema);