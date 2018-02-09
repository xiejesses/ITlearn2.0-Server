var express = require('express')
var router = express.Router();
var Comments = require('../models/Comment');
var Reply = require('../models/Reply');
const Topic = require('../models/Topic');
const User = require('./../models/User');

/**
 * 创建评论
 */
router.post("/createcomment", function (req, res, next) {
    
    User.findOne({userName:req.body.userName}, (err, user) => {
        if(err){
            res.json({
                message:'找不到其用户，请重试！'
            })
        } else {
            let newcomment = new Comments({
                content:req.body.content,
                author:user._id
            })
            newcomment.save((err,doc) => {
                if(err) {
                    res.json({
                        message:'存入数据失败，请重试！'
                    })
                } else {
                    Topic.findOne({_id:req.body.t_id}, (err, topic) => {
                        if(err) {
                            res.json({
                                status:"0"
                            })
                        } else {
                            topic.comments.push(doc._id);
                            topic.save();
                            res.json({
                                status:"1",
                            })
                        }
                    })
                    
                }
            })
        }
    }).catch(err => res.json(err))
});

/**
 * 获取评论
 */
router.get("/fetchcomment", function(req, res, next) {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let skip = (page - 1) * pageSize;

    let t_id = req.param('t_id');
    /**
     * 运用了 populate 嵌套，这样就可以查询出对应 comment 里的 author 和 replys, 以及 replys里的author
     */
    let topicModel = Topic.findOne({_id:t_id}).populate({
        path:'comments',
        populate:{
            path:'author replys',
            select:'userName userEmail content createTime author',
            populate:{path:'author',select:'userName userEmail'}  //填充 replys 里的 author
        }
    });
    topicModel.exec((err, doc) => {
        if (err) {
            res.json({
                status:'0',
                msg:err.message
            });
        } else {
            res.json({
                status:'1',
                msg:'',
                result:{
                    count:doc.comments.length,
                    list:doc,
                }
            });
        }
    })
})

/**
 * 创建回复
 */
router.post("/createreply", function (req, res, next) {
    
    User.findOne({userName:req.body.userName}, (err, user) => {
        if(err){
            res.json({
                status:'0',
                message:'找不到其用户，请重试！'
            })
        } else {

            let newreply = new Reply({
                content:req.body.content,
                author:user._id
            })
            newreply.save((err,reply) => {
                if(err) {
                    res.json({
                        status:'0',
                        message:'存入数据失败，请重试！'
                    })
                } else {
                    let commentModel = Comments.findOne({_id:req.body.c_id}).populate({path:'reply'})
                    commentModel.exec((err, this_comment) => {
                        if (err) {
                            res.json({
                                status:'0',
                                msg:err.message
                            });
                        } else {
                            this_comment.replys.push(reply._id);
                            this_comment.save();
                            res.json({
                                status:'1',
                                msg:'回复成功！',
                            });
                        }
                    })
                    
                }
            })
        }
    }).catch(err => res.json(err))
});


module.exports = router;