'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: process.env.OPENSHIFT_DATA_DIR});
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.post('/upload/file',upload.single('file'),function(req,res,next){    
    if(req.file !== undefined && req.file.path !== undefined) {
        
        var filename = req.file.originalname;
        fs.readFile(req.file.path, function (err, data) {
    
            var filePath = process.env.OPENSHIFT_DATA_DIR + filename;
            
            fs.writeFile(filePath, data, function (err) {
                if(err){
                    res.status(403).send(err);
                }else{
                    res.status(200).end();    
                }                
            });
        });
        
    }else{
        res.status(403).send('file not uploaded');
    }
})
.get('/:filename', function(req,res,next) {
    var filename = req.params.filename;
    res.sendFile(process.env.OPENSHIFT_DATA_DIR+filename); 
});

module.exports = router;