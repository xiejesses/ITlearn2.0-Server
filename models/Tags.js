/**
 * 标签模型
 * tags : 标签
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let TagsSchema = new Schema({
    tags:Array
})

module.exports = mongoose.model('tags',TagsSchema)