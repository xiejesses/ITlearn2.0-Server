/**
 * 话题模型
 * title      : 话题标题
 * content    : 话题内容
 * comments   : 该话题下所包含的评论，ref 指向 comment 模型
 * createTime : 创建时间
 * author     : 创建该话题用户
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
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'},
    comments: [{type: Schema.Types.ObjectId, ref: 'comment'}]
})

module.exports = mongoose.model('topic',TopicSchema)