const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const sha1 = require('sha1');
const objectIdToTimestamp = require('objectid-to-timestamp');


/**
 * 获取用户收藏的文章
 */
router.get('/getlovelink', function (req, res, next) {
    User.findOne({userName: req.param('userName')}).select({lovelink: 1})
        .exec((err, doc) => {
            if (err) {
                res.json({
                    status: '0',
                    message: err.message
                })
            } else {
                res.json({
                    status: '1',
                    doc
                });
            }
        })
});


/**
 * 用户注册
 */
router.route('/')

    // post 方法
    .post(function (req, res, next) {
        let userRegister = new User(req.body);

        User.findOne({
            userName: userRegister.userName
        }).then(user => {
            if (user) {
                res.json({
                    status: "0",
                    message: '该用户名已存在'
                });
            } else {
                userRegister.save((err, user) => {
                    if (err) {
                        res.json({
                            message: '错误了',
                            err: err
                        });
                    } else {
                        res.json({
                            status: "1",
                            message: '注册成功！',
                            token: jwt.sign({userName: user.userName}, "ITlearn", {expiresIn: '1d'}), //返回 token, 秘钥：ITlearn, 开发用过期时间是 1 天
                            user: {
                                userName: user.userName,
                                userEmail: user.userEmail
                            },
                            createTime: moment(user.createTime).format('YYYY-MM-DD HH:mm:ss')
                        });
                    }
                })
            }
        })
        .catch(err => res.json(err));
    });



/**
 * 用户登录
 */
router.post('/login', function (req, res, next) {

    let userLogin = new User({
        userEmail: req.body.userEmail,
        userPwd: req.body.userPwd //开发暂时不用加密
    });

    User.findOne({userEmail: userLogin.userEmail})
        .then(user => {
            if (!user) {
                res.json({
                    success: false,
                    message: "账号不存在"
                });
            } else if (userLogin.userPwd === user.userPwd) {
                res.json({
                    status: "1",
                    message: "登录成功",
                    token: jwt.sign({
                        userName: user.userName
                    }, "ITlearn", {
                        expiresIn: '1d'
                    }),
                    user: {
                        userName: user.userName,
                        userEmail: user.userEmail
                    }
                })
            } else {
                res.json({
                    status: "0",
                    message: "密码错误"
                });
            }
        })
        .catch(err => {
            res.status(404);
            res.json(err)
        });
});

module.exports = router;
