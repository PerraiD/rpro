'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.post('/upload/file',function(res,req,next){
    res.send(process.env.OPENSHIFT_DATA_DIR+ " " +process.env.OPENSHIFT_TMP_DIR);
});