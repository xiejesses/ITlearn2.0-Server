// import { mongo, Mongoose } from 'mongoose';
var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const ShareLink = require('./../models/ShareLink');

/* GET users listing. */
router.get('/save', function(req, res, next) {
    let author = new User({
        // _id: new mongoose.Types.ObjectId(),
        userName:'jesses1',
        userEmail:'8888988@qq.com',
        userPwd:'123456789',
    })

    author.save(err => {
        if(err) {
            res.json({
                message:'用户存储失败！'
            })
        } else {
            let sharelink1 = new ShareLink({
                title:'vue 大法好',
                url:'http://vue.com',
                tag:'Vue',
                voteNumber:10,
                voteActive:false,
                author:author._id
            })
            sharelink1.save(err => {
                if(err) {
                    res.json({
                        message:'sharelink存储失败！'
                    })
                } else {
                    res.json({
                        message:'两步成功！'
                    })
                }
                
            })
        }
        
    })
    // .catch(err => res.json(err))
});

/**
 * 用户收藏分享链接
 */
router.get('/addlovelink', function(req, res, next) {
    // let user = new User({
    //     userName:'jesses'
    // })
    ShareLink.findOne({title:'test'})
    .populate('author')
    .exec((err, sharelink) => {
        if(err) {
            res.json({message:'查找失败'})
        } else {
            sharelink.author.lovelink.push(sharelink._id)
            sharelink.author.save(err => {
                if(err) {res.json({message:'失败'})}
                else {res.json({sharelink})}
            })
            
        }
    })
});



/**
 * 列出所有用户收藏的分享链接
 */
router.get('/findlovelink', function(req, res, next) {
    User.findOne({userName:'jesses1'})
    .populate('lovelink')
    .exec((err, user) => {
        if(err) {
            res.json({message:'查找失败'})
        } else {
            // sharelink.author.lovelink = sharelink._id;
            res.json({user})
        }
    })
});

module.exports = router;
