const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const sha1 = require('sha1')

const objectIdToTimestamp = require('objectid-to-timestamp')

/**
 * 获取用户收藏的文章
 */
router.get('/getlovelink', function (req, res, next) {
  User.findOne({
      userName: req.param('userName')
    }).select({
      lovelink: 1
    })
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
        })
      }
    })
});
/**
 * 获取用户加入的小组
 */
router.get('/getlovegroup', function (req, res, next) {
  User.findOne({
      userName: req.param('userName')
    }).select({
      lovegroup: 1
    })
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
        })
      }
    })
});

/**
 * 用户注册
 */
router.post('/register', function (req, res, next) {

  let userRegister = new User({
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    // userPwd:sha1(req.body.userPwd)  //密码加密再存入数据库
    userPwd: req.body.userPwd //开发暂时不用加密
  })

  User.findOne({
    userName: userRegister.userName
  }).then(user => {
    if (user) {
      res.json({
        status: "0",
        message: '该用户名已存在'
      })
    } else {
      User.findOne({
        userEmail: userRegister.userEmail
      }).then(user => {
        if (user) {
          res.json({
            status: "0",
            message: '该邮箱已被注册'
          })
        } else {
          userRegister.save((err, user) => {
            if (err) {
              res.json({
                message: '注册失败，请重试',
                err: err
              })
            } else {
              res.json({
                status: "1",
                message: '注册成功！',
                //返回 token, 秘钥：ITlearn, 开发用过期时间是 1 天
                token: jwt.sign({
                  userName: user.userName
                }, "ITlearn", {
                  expiresIn: '1d'
                }),
                user: {
                  userName: user.userName,
                  userEmail: user.userEmail
                },
                createTime: moment(user.createTime).format('YYYY-MM-DD HH:mm:ss')
              })
            }
          })
        }
      })
    }
  })
})

/**
 * 用户登录
 */
router.post('/login', function (req, res, next) {
  let userLogin = new User({
    userEmail: req.body.userEmail,
    // userPwd:sha1(req.body.userPwd)
    userPwd: req.body.userPwd //开发暂时不用加密
  })
  User.findOne({
      userEmail: userLogin.userEmail
    })
    .then(user => {
      if (!user) {
        res.json({
          success: false,
          message: "账号不存在"
        })
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
          },
        })
      } else {
        res.json({
          status: "0",
          message: "密码错误"
        })
      }
    })
    .catch(err => res.json(err))
});

/**
 * 查询用户所有信息，除了密码
 */
router.post('/getuserinfo', function (req, res, next) {
  User.findOne({
      userName: req.body.userName
    }).select({
      userPwd: 0
    })
    .exec((err, doc) => {
      if (err) {
        res.json({
          status: '0',
          message: err.message
        })
      } else {
        User.findOne({
          userName:req.body.currentUser
        })
        .select({following:1})
        .exec((err,currentuser) => {
          if (err) {
            res.json({
              status: '0',
              message: err.message
            })
          } else {
            res.json({
              status: '1',
              doc,
              currentuser
            })
          }
        })
        
      }
    })
});
/**
 * 更新用户介绍
 */
router.post('/updateintro', function (req, res, next) {
  // let userLogin = new User({
  //   userName: req.body.userName,
  //   // userPwd:sha1(req.body.userPwd)
  //   userIntro: req.body.userIntro 
  // })
  User.update({
      userName: req.body.userName
    },{
      userIntro:req.body.userIntro 
    },(err,doc) => {
      if(err) {
        res.json({
          status: "0",
          message: "更新错误"
        })
      } else {
        res.json({
          status:'1',
          message:'更新成功',
        })
      }
    })
    
    // .catch(err => res.json(err))
});
 /**
  * 关注用户
  */
router.post('/following', function (req, res, next) {
  // let userLogin = new User({
  //   userEmail: req.body.userEmail,
  //   // userPwd:sha1(req.body.userPwd)
  //   userPwd: req.body.userPwd //开发暂时不用加密
  // })
  User.findOne({
      userName: req.body.currentUser
    })
    .select({following:1})
    .exec((err, currentuser) => {
      if (err) {
        res.json({
          success: false,
          message: "账号不存在"
        })
      } else {
        User.findOne({
          userName:req.body.userName
        }).select({follower:1})
        .exec((err, user) => {
          if (err) {
            res.json({
              success: false,
              message: "账号不存在"
            })
          } else {
            let user_index = currentuser.following.indexOf(user._id);
            if(user_index === -1) {
              currentuser.following.push(user._id);
              user.follower.push(currentuser._id);
              currentuser.save();
              user.save();
              res.json({
              status:"1",
              currentuser,
              user
            })
            } else {
              currentuser.following.splice(user_index,1);
              currentuser.save();
              let currentuser_index = user.follower.indexOf(currentuser._id);
              user.follower.splice(currentuser_index,1)
              user.save();
              res.json({
                status:"0",
                message:"已取消关注"
              })
            }
            
          }
        })
      }
    }) 
});


module.exports = router;