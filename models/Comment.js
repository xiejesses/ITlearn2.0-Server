/**
 * 评论模型
 * content: 评论内容
 * author : 发评论者，ref 指向 user 模型
 * replys : 回复当前评论，ref 指向 replys 模型
 * createTime : 评论时间
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    content: {
        type:String,
        required:true,
        trim:true
    },
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'},
    replys: [{type: Schema.Types.ObjectId, ref: 'replys'}]
})

module.exports = mongoose.model('comment',CommentSchema)