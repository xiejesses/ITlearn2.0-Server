var express = require('express')
var router = express.Router();
// var shareLink = require('../models/ShareLinkModel'); //旧的
var mongoose = require('mongoose');
const User = require('./../models/User');
const ShareLink = require('./../models/ShareLink');


router.get("/", function (req, res, next) {

    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let skip = (page - 1) * pageSize;

    let sharelinkModel = ShareLink.find().populate({path:'author',select:'userName userEmail'}).skip(skip).limit(pageSize);
    sharelinkModel.exec(function(err,doc) {
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
    // shareLink.find({}, function (err,doc) {
        
    // })
});

router.post('/submit',function(req, res, next) {

    User.findOne({userName:req.body.userName}, (err, user) => {
        if(err){
            res.json({
                message:'找不到其用户，请重试！'
            })
        } else {
            let s_sharelink = new ShareLink({
                url:req.body.url,
                title:req.body.title,
                tags:req.body.tags,
                author:user._id
            })
            s_sharelink.save(err => {
                if(err) {
                    res.json({
                        message:'存入数据失败，请重试！'
                    })
                } else {
                    res.json({
                        status:"1",
                        message:"发布成功！",
                    })
                }
            })
            // s_sharelink.save().populate('author')
            // .exec((err, sharelink) => {
            //     if(err) {
            //         res.json({message:'存入失败！'})
            //     } else {
            //         sharelink.author.lovelink = sharelink._id;
            //         sharelink.author.save(err => {
            //             if(err) {res.json({message:'用户存入失败'})}
            //             else {res.json({
            //                 status:"1",
            //                 message:"发布成功",
            //                 sharelink
            //             })}
            //         })
            //     }
            // })
        }
    })

    
})
router.post('/addlovelink',function(req, res, next) {
    
    User.findOne({
        // userName:req.param('userName'),
        userName:req.body.userName,
        // lovelink:req.param('_id')
    }, (err,user) => {
        if(err){
            res.json({
                // err,
                status:'0',
                message:'用户不存在'
            })
        } else {
            // res.json({
            //     user
            // })
            // let lovelink_id = req.param('_id');
            let lovelink_id = req.body._id;
            lovelink_index = user.lovelink.indexOf(lovelink_id)
            if(lovelink_index === -1) {
                //不存在
                user.lovelink.push(lovelink_id);
                user.save();
                res.json({
                    status:"1",
                    // heartclick:true,
                    message:'成功添加收藏！'
                })
            } else {
                user.lovelink.splice(lovelink_index,1);
                user.save();
                res.json({
                    status:"2",
                    // heartclick:false,
                    message:'取消收藏！'
                })
            }
            
            // let lovelink_id = req.param('_id');
            // User.findOne({lovelink:lovelink_id}, (err, lovelink) => {
            //     if(err){
            //         //删除操作
            //     } else {
            //         lovelink.push(lovelink_id);
            //         user.save();
            //         res.json({
            //             // id:link_id,
            //             status:'1',
            //             message:'收藏成功！',
            //             user_lovelink:user.lovelink,
            //             user
            //         })
            //     }
            // })
        }
    })
    // User.findOne({
    //     userName:req.param('userName'),
    //     lovelink:req.param('_id')
    // }, (err,user) => {
    //     if(err){
    //         res.json({
    //             status:'0',
    //             message:'用户不存在'
    //         })
    //     } else {
    //         let lovelink_id = req.param('_id');
    //         User.findOne({lovelink:lovelink_id}, (err, lovelink) => {
    //             if(err){
    //                 //删除操作
    //             } else {
    //                 lovelink.push(lovelink_id);
    //                 user.save();
    //                 res.json({
    //                     // id:link_id,
    //                     status:'1',
    //                     message:'收藏成功！',
    //                     user_lovelink:user.lovelink,
    //                     user
    //                 })
    //             }
    //         })
    //     }
    // })

    
})



module.exports = router;