var express = require('express')
var router = express.Router();
const Group = require('../models/Group');
const Topic = require('../models/Topic');
const User = require('./../models/User');

/**
 * 创建话题
 */
router.post("/createtopic", function (req, res, next) {

    User.findOne({userName:req.body.userName}, (err, user) => {
        if(err){
            res.json({
                message:'找不到其用户，请重试！'
            })
        } else {
            let newtopic = new Topic({
                title:req.body.topicTitle,
                content:req.body.topicContent,
                author:user._id
            })
            newtopic.save((err,doc) => {
                if(err) {
                    res.json({
                        message:'存入数据失败，请重试！'
                    })
                } else {
                    Group.findOne({_id:req.body._id}, (err, group) => {
                        if(err) {
                            res.json({
                                status:"0"
                            })
                        } else {
                            group.groupTopic.push(doc._id);
                            group.save();
                            res.json({
                                status:"1",
                            })
                        }
                    })
                    
                }
            })
        }
    })
});

/**
 * 获取话题
 */
router.get("/fetchtopic", function(req, res, next) {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let skip = (page - 1) * pageSize;

    let g_id = req.param('g_id');
    /**
     * 运用了 populate 嵌套，这样就可以查询出对应 topic 里的 author
     */
    let groupModel = Group.findOne({_id:g_id}).populate({
        path:'groupTopic',
        populate:{path:'author',select:'userName userEmail'}
    });
    groupModel.exec((err, doc) => {
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
                    count:doc.groupTopic.length,
                    list:doc,
                }
            });
        }
    })
})

/**
 * 获取当前话题详情
 */
router.get('/fetchtopicdetail', function(req, res, nex) {
    let t_id = req.param('t_id');
    let topicModel = Topic.findOne({_id:t_id}).populate({path:'author',select:'userName userEmail'});
    topicModel.exec((err, doc) => {
        if (err) {
            res.json({
                status:'0',
                msg:err.message
            });
        } else {
            res.json({
                status:'1',
                result:doc
            });
        }
    })
})

module.exports = router;