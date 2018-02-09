/**
 * 首页分享文章列表模型
 * title      : 文章标题
 * url        : 文章来源地址
 * tags       : 当前文章所包含的标签
 * voteNumber : 当前文章所获得的投票数（赞数）
 * createTime : 创建时间
 * author     : 分享该文章的用户
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
let user = require('./User')

let ShareLinkSchema = new Schema({
    title: String,
    url: String,
    tags: Array,
    voteNumber:{ type:Number,default:0},
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'}
})

module.exports = mongoose.model('sharelink',ShareLinkSchema)