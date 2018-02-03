/*
**首页分享文章列表模型
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
    // voteActive: {type:Boolean,default:false},
    createTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'user'}
})

module.exports = mongoose.model('sharelink',ShareLinkSchema)