var express = require('express')
var router = express.Router();
var shareLink = require('../models/ShareLinkModel');


router.get("/", function (req, res, next) {

    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let skip = (page - 1) * pageSize;

    let sharelinkModel = shareLink.find().skip(skip).limit(pageSize);
    sharelinkModel.exec(function(err,doc) {
        if (err) {
            res.json({
                status:'1',
                msg:err.message
            });
        } else {
            // console.log(doc);
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    })
    // shareLink.find({}, function (err,doc) {
        
    // })
});



module.exports = router;