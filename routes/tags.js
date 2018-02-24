var express = require('express')
var router = express.Router();
var Tag = require('../models/Tags');

/**
 * 获取文章标签
 */
router.get("/", function (req, res, next) {
    if(req.param('tag')) {
        Tag.findOne({name:req.param('tag')}).then(tag => {
            if(tag) {
                res.json({
                    status:"1",
                    result:tag
                })
            } else {
                res.json({
                    status:"0"
                })
            }
        })
    } else {
        Tag.find().then(tags => {
            if(tags) {
                res.json({
                    status:"1",
                    result:tags
                })
            } else {
                res.json({
                    status:"0"
                })
            }
        })
    }
    
});



module.exports = router;