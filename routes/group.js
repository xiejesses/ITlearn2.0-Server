var express = require('express')
var router = express.Router();
const Group = require('../models/Group');
const User = require('./../models/User');

/**
 * 创建小组
 */
router.post("/creategroup", function (req, res, next) {
    
    User.findOne({userName:req.body.userName}, (err, user) => {
        if(err){
            res.json({
                message:'找不到其用户，请重试！'
            })
        } else {
            let newgroup = new Group({
                groupName:req.body.groupName,
                groupIntro:req.body.groupIntro,
                author:user._id
            })
            newgroup.save(err => {
                if(err) {
                    res.json({
                        message:'存入数据失败，请重试！'
                    })
                } else {
                    res.json({
                        status:"1",
                        message:"创建成功！",
                    })
                }
            })
        }
    })
});

/**
 * 获取小组
 */
router.get("/fetchgroup", function (req, res, next) {

    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let uName = req.param("userName");
    let skip = (page - 1) * pageSize;

    if (!uName) {
        let groupModel = Group.find().populate({path:'author',select:'userName userEmail'}).skip(skip).limit(pageSize).sort({createTime:-1});
        groupModel.exec(function(err,doc) {
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
                        count:doc.length,
                        list:doc,
                    }
                });
            }
        })
    } else {
        //populate里的分页要用options选项，不能直接用skip()、limit()函数
        User.findOne({userName:uName}).select({lovegroup:1}).populate({
            path:'lovegroup',
            options: {
                limit: pageSize,
                // sort: { created: -1},
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
                        count: doc.lovegroup.length,
                        list: doc.lovegroup,
                    }
                });
            }
        })
    }
})

/**
 * 获取当前小组详细内容
 */
router.get('/fetchgroupdetail', function(req, res, nex) {
    let g_id = req.param('g_id');

    User.findOne({
        userName: req.param('userName'),
    }).select({_id:1})
    .exec((err,user) => {
        if (err) {
            res.json({
                status: '0',
                message: '用户不存在'
            })
        } 
        else {
            let groupModel = Group.findOne({_id:g_id}).populate({
                path:'author',select:'userName userEmail'
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
                        result:doc,
                        user
                    });
                }
            })
        }
    })
  
})

/**
 * 加入小组
 */
router.post('/joingroup', function (req, res, next) {

    User.findOne({
        userName: req.body.userName,
    }, (err, user) => {
        if (err) {
            res.json({
                status: '0',
                message: '用户不存在'
            })
        } else {
            Group.findOne({_id:req.body._id}).select({member:1})
                .exec((err,group) => {
                    if(err) {
                        res.json({
                            status: '0',
                            message: '小组不存在'
                        })
                    } else {
                        let lovegroup_id = req.body._id;
                        lovegroup_index = user.lovegroup.indexOf(lovegroup_id)
                        if (lovegroup_index === -1) {
                            //用户没加入该小组
                            user.lovegroup.push(lovegroup_id);
                            user.save();
                            group.member.push(user._id);
                            group.save()
                            res.json({
                                    status: "1",
                                    lovegroup: user.lovegroup,
                                    group,
                                    message: '退出小组'
                                })
                        } else {
                            //用户已经加入该小组，退出该小组
                            user.lovegroup.splice(lovegroup_index, 1);
                            user.save();
                            group.member.splice(group.member.indexOf(user._id),1);
                            group.save();
                            res.json({
                                status: "2",
                                lovegroup: user.lovegroup,
                                group,
                                message: '加入小组'
                            })
                        }
                        
                       
                    }
                })
        }
    })
})


module.exports = router;