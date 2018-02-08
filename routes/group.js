var express = require('express')
var router = express.Router();
const Group = require('../models/Group');
const User = require('./../models/User');


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

router.get("/fetchgroup", function (req, res, next) {

    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let skip = (page - 1) * pageSize;

    let groupModel = Group.find().populate({path:'author',select:'userName userEmail'}).skip(skip).limit(pageSize);
    groupModel.exec(function(err,doc) {
        if (err) {
            res.json({
                status:'0',
                msg:err.message
            });
        } else {
            // console.log(doc);
            res.json({
                status:'1',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc,
                    // author:
                }
            });
        }
    })
})

router.get('/fetchgroupdetail', function(req, res, nex) {
    let g_id = req.param('g_id');
    // console.log(req.param('g_id'));
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
            // console.log(doc);
            res.json({
                status:'1',
                // msg:'',
                result:doc
            });
        }
    })
})


module.exports = router;