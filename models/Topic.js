/*
**话题模型
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

let TopicSchema = new Schema({
    title: {
        type:String,
        required:true,
        trim:true
    },
    content: {
        type:String,
        required:true,
        trim:true
    },
    // voteNumber:{ type:Number,default:0},
    // voteActive: {type:Boolean,default:false},
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'},
    comments: [{type: Schema.Types.ObjectId, ref: 'comment'}]
})

module.exports = mongoose.model('topic',TopicSchema)