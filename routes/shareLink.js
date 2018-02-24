var express = require('express')
var router = express.Router();
var mongoose = require('mongoose');
const User = require('./../models/User');
const Tags = require('./../models/Tags');
const ShareLink = require('./../models/ShareLink');
const url = require('url')

// Array.prototype.Lcase=function(){
// 	for (i=0;i<this.length;i++){
// 		this[i]=this[i].toLowerCase();
// 	}
// }

/**
 * 获取首页文章列表
 */
router.get("/", function (req, res, next) {

    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let uName = req.param("userName");
    let tag = req.param("tag");
    let skip = (page - 1) * pageSize;

    //首页
    if (!uName && !tag) {
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
    } else if(tag) {
        //标签相关的分享链接
        let sharelinkModel = ShareLink.find({tags:tag}).populate({
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
        //用户收藏的分享链接
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
    let myurl = url.parse(req.body.url);
    //将标签都转为小写
    let tags = req.body.tags;
    for(let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase()
    }

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
                tags: tags,
                author: user._id
            })
            s_sharelink.save(err => {
                if (err) {
                    res.json({
                        message: '存入数据失败，请重试！'
                    })
                } else {
                    //传进的tag如果是数组，拆分存进数据库
                    let tagName = req.body.tags;
                    for(let i = 0; i < tagName.length; i++) {
                        Tags.findOne({name:tagName[i].toLowerCase()})
                        .then(tag => {
                            //如果数据库里没存在当前标签才存入，否则不存入
                            if(!tag) {
                                let s_tag = new Tags({
                                    name: tagName[i].toLowerCase()
                                    // label: req.body.tags
                                })
                                s_tag.save();
                            }
                             
                        })
                        
                    }
                    
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