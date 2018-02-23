var express = require('express')
var router = express.Router();
var mongoose = require('mongoose');
const User = require('./../models/User');
const ShareLink = require('./../models/ShareLink');
const url = require('url')

/**
 * 获取首页文章列表
 */
router.get("/", function (req, res, next) {

    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let uName = req.param("userName");
    let skip = (page - 1) * pageSize;

    if (!uName) {
        let sharelinkModel = ShareLink.find().populate({
            path: 'author',
            select: 'userName userEmail lovelink'
        }).skip(skip).limit(pageSize).sort({createTime:-1});
        sharelinkModel.exec(function (err, doc) {
            if (err) {
                res.json({
                    status: '0',
                    msg: err.message
                });
            } else {
                res.json({
                    status: '1',
                    msg: '',
                    result: {
                        count: doc.length,
                        list: doc,
                    }
                });
            }
        })
    } else {
        //populate里的分页要用options选项，不能直接用skip()、limit()函数
        User.findOne({userName:uName}).select({lovelink:1}).populate({
            path:'lovelink',
            options: {
                limit: pageSize,
                sort: { createTime: -1},
                skip: skip
            },
            populate:{path:'author',select:'userName userEmail'}
        })
        .exec((err,doc) => {
            if (err) {
                res.json({
                    status: '0',
                    msg: err.message
                });
            } else {
                res.json({
                    status: '1',
                    msg: '',
                    result: {
                        count: doc.lovelink.length,
                        list: doc.lovelink,
                    }
                });
            }
        })
    }

});

/**
 * 分享文章链接
 */
router.post('/submit', function (req, res, next) {
    let myurl = url.parse(req.body.url)
    User.findOne({
        userName: req.body.userName
    }, (err, user) => {
        if (err) {
            res.json({
                message: '找不到其用户，请重试！'
            })
        } else {
            let s_sharelink = new ShareLink({
                url: req.body.url,
                urlhostname: myurl.hostname,
                title: req.body.title,
                tags: req.body.tags,
                author: user._id
            })
            s_sharelink.save(err => {
                if (err) {
                    res.json({
                        message: '存入数据失败，请重试！'
                    })
                } else {
                    res.json({
                        status: "1",
                        message: "发布成功！",
                    })
                }
            })
        }
    })
})

/**
 * 添加收藏
 */
router.post('/addlovelink', function (req, res, next) {

    User.findOne({
        userName: req.body.userName,
    }, (err, user) => {
        if (err) {
            res.json({
                status: '0',
                message: '用户不存在'
            })
        } else {

            let lovelink_id = req.body._id;
            lovelink_index = user.lovelink.indexOf(lovelink_id)
            if (lovelink_index === -1) {
                //不存在
                user.lovelink.push(lovelink_id);
                user.save();
                res.json({
                    status: "1",
                    lovelink: user.lovelink,
                    message: '成功添加收藏！'
                })
            } else {
                user.lovelink.splice(lovelink_index, 1);
                user.save();
                res.json({
                    status: "2",
                    lovelink: user.lovelink,
                    message: '取消收藏！'
                })
            }
        }
    })
})

/**
 * 投票
 */
router.post('/vote', function (req, res, next) {
    ShareLink.update({
        _id: req.body.article_id
      },{"$inc":{"voteNumber":1}}, //利用$inc，使voteNumber自增一
      (err,doc) => {
        if(err) {
          res.json({
            status: "0",
            message: "更新错误"
          })
        } else {
          res.json({
            status:'1',
            message:'投票成功',
          })
        }
      })
      
      // .catch(err => res.json(err))
  });

module.exports = router;