var express = require('express')
var router = express.Router();
var Tag = require('../models/Tags');


router.get("/", function (req, res, next) {

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
});



module.exports = router;