const express = require('express');
const router = express.Router();
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const sha1 = require('sha1')
const objectIdToTimestamp = require('objectid-to-timestamp')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  let userRegister = new User({
    // userName:req.param("userName"),
    // userEmail:req.param("userEmail"),
    // userPwd:req.param("userPwd"),
    userName:req.body.userName,
    userEmail:req.body.userEmail,
    userPwd:sha1(req.body.userPwd)  //密码加密再存入数据库
  })

  // userRegister.createTime = moment(Date.now).format('YYYY-MM-DD HH:mm:ss');

  User.findOne({
    userName: userRegister.userName
  }).then(user => {
    if(user) {
      res.json({
        status:"0",
        message:'该用户名已存在'
      })
    } else {
      userRegister.save((err, user) => {
        if(err) {
          res.json({
            message:'错误了',
            err:err
          })
        } else {
          res.json({
            status:"1",
            message:'成功存入！',
            token: jwt.sign({
              userEmail: user.userName
            },"ITlearn",{
              expiresIn:'1d'
            }),
            user:{
              userName:user.userName,
              userEmail:user.userEmail
            },
            createTime:moment(user.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        }
      })
    }
  }).catch(err => res.json(err))
})

router.post('/login', function(req, res, next) {
  let userLogin = new User({
    // userName:req.param("userName"),
    // userEmail:req.param("userEmail"),
    // userPwd:req.param("userPwd")
    // userName:req.body.userName,
    userEmail:req.body.userEmail,
    userPwd:sha1(req.body.userPwd)
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
          status:"1",
          message: "登录成功",
          token: jwt.sign({
                  userName: user.userName
                },"ITlearn",{
                  expiresIn:'1d'
                }),
          user:{
            userName:user.userName,
            userEmail:user.userEmail
          },
          // userEmail:user.userEmail,
          // userName:user.userName
          // session: req.session,
          // name: user.name,
          // 账户创建日期
          // time: moment(objectIdToTimestamp(user._id))
          //   .format('YYYY-MM-DD HH:mm:ss')
        })
      } else {
        res.json({
          status:"0",
          message: "密码错误"
        })
      }
    })
    .catch(err => res.json(err))
});






// router.post("/login", function(req,res,next) {
//   // let param = {
//   //   userEmail:req.body.userEmail,
//   //   userPwd:req.body.userPwd
//   // }
//   let param = {
//     userEmail:req.param("userEmail"),
//     userPwd:req.param("userPwd")
//   }
//   console.log(param);
//   User.findOne(param,function(err,doc) {

//     if(doc) {
//       res.json({
//         err:err,
//         doc:doc,
//         status:'0',
//         msg:'',
//         token: jwt.sign({
//           name: doc.userEmail
//         },"ITlearn",{
//           expiresIn:'1d'
//         }),
//         result:{
//           userEmail:doc.userEmail
//         }
//       })
//     } else if(err) {
//       res.json({
//         status:"1",
//         msg:err.message
//     });
//     } else {
//       return new Error('The database does error');
//     }


//     // if(err){
//     //   res.json({
//     //       status:"1",
//     //       msg:err.message
//     //   });
//     // } else {
//     //   if(doc) {
//     //     res.json({
//     //       err:err,
//     //       doc:doc,
//     //       status:'0',
//     //       msg:'',
//     //       token: jwt.sign({
//     //         name: doc.userEmail
//     //       },"ITlearn",{
//     //         expiresIn:'1d'
//     //       }),
//     //       result:{
//     //         userEmail:doc.userEmail
//     //       }
//     //     })
//     //   }
//     // }
//   }).catch(err => {
//     res.json(err)
//   })
// })


module.exports = router;
