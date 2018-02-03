var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./models/db');

const jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

var index = require('./routes/index');
var users = require('./routes/users');
var shareLink = require('./routes/shareLink');
var testJWT = require('./routes/testJWT');
var Tags = require('./routes/tags');
var Group = require('./routes/group');
// var testNewModel = require('./routes/testNewModel');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//全局拦截器，验证每个发来请求里的token,注意要放到其它路由的前面
var secretOrPrivateKey = "ITlearn"  //加密token 校验token时要使用
app.use(expressJWT({
    secret: secretOrPrivateKey   
}).unless({
    path: ['/token/get','/tags','/testnewmodel/save','/testnewmodel/addlovelink','/testnewmodel/findlovelink','/sharelink','/users/login','/users/register']  //除了这个地址，其他的URL都需要验证
}));



app.use('/', index);
app.use('/users', users);
app.use('/sharelink',shareLink)
app.use('/token',testJWT)
app.use('/tags',Tags)
app.use('/group',Group)

// app.use('/testnewmodel',testNewModel)


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {   
      //  错误处理
    res.status(401).send('invalid token...');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
