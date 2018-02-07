/*
**回复评论模型
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let ReplySchema = new Schema({
    content: {
        type:String,
        required:true,
        trim:true
    },
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'},
})

module.exports = mongoose.model('replys',ReplySchema)