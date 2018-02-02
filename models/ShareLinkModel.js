/*
**首页分享文章列表模型
*/
let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let shareLinkSchema = new Schema({
    "id": Number,
    "userName": String,
    "email": String,
    "domain": String,
    "articleTitle": String,
    "articleLink": String,
    "createTime": {type : Date, default : Date.now},
    "tag": String,
    "vote": Number,
    "voteActive": String,
    "heartActive": String
});
// let testSchema = new Schema({
//     "name": String,
// });

module.exports = mongoose.model('sharelink',shareLinkSchema)
// module.exports = mongoose.model('test',testSchema)