/**
 * 回复评论模型
 * content    : 回复当前评论的内容
 * createTime : 回复时间
 * author     : 回复的用户
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