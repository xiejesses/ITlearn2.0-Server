/**
 * 数据库连接
 * 数据库名: ITlearn
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ITlearn');

mongoose.connection.on("connected", function () {
    console.log("connected success")
});
mongoose.connection.on("error", function () {
    console.log("connected fail")
});
mongoose.connection.on("disconnected", function () {
    console.log("disconnected")
});