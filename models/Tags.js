/*
**标签模型
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let TagsSchema = new Schema({
    tags:Array
})

module.exports = mongoose.model('tags',TagsSchema)