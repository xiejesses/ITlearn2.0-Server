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



module.exports = router;