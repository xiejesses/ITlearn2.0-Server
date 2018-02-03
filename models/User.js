/*
**用户模型
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
let sharelink = require('./ShareLink')

let UserSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    // userName:String,
    // userEmail:String,
    // userPwd:String,
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
    },
    // sharelink: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'sharelink'
    // }],
    lovelink:[
        {type: Schema.Types.ObjectId,ref: 'sharelink',}
    ],
    lovelink: [{
        type: Schema.Types.ObjectId,
        ref: 'sharelink'
    }],
    following: Array,
    follower: Array
})

module.exports = mongoose.model('user',UserSchema);

