/**
 * 标签模型
 * tags : 标签
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let TagsSchema = new Schema({
    // tags:Array
    name:String,
    styleObject:{
        background:{type:String,default:'#ffffff'},
        color:{type:String,default:'#54595f'}
    }
    // label:String
})

module.exports = mongoose.model('tags',TagsSchema)