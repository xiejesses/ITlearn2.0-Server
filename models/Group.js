/*
**小组模型
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

let GroupSchema = new Schema({
    groupName: {
        type:String,
        required:true,
        trim:true,
    },
    groupIntro: String,
    // tags: Array,
    member:{ type:Number,default:0},
    // voteActive: {type:Boolean,default:false},
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'}
})

module.exports = mongoose.model('group',GroupSchema)