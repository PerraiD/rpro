'use strict';
var fs          = require('fs');
var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));


// get log by date : format : DD-MM-YYYY i.e 22-03-2016
router.get('/:date', function(req,res,next){
 
  var file = './logs/access-'+req.params.date+'.log';
  //we check if the file exist
  fs.exists(file, (exists) => {
    if (exists) {
        fs.readFile(file, (err, data) => {
            if (err)  res.status(500).send(err);
            res.send(data);
        });
    }else{
        res.status(404).end();
    }
  });
    
  
})

module.exports = router;