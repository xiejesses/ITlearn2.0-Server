/**
 * 小组模型
 * groupName  : 小组名称
 * groupIntro : 小组介绍
 * groupTopic : 当前小组下发表的话题，ref 指向 topic 模型
 * member     : 加入当前小组的用户
 * createTime : 创建当前小组的时间
 * author     : 创建当前小组的用户
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
    groupTopic: [{
        type: Schema.Types.ObjectId,
        ref: 'topic'
    }],
    member:{ type:Number,default:0},
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'}
})

module.exports = mongoose.model('group',GroupSchema)