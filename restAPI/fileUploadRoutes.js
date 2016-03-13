'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var fs = require('fs');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.post('/upload/file',function(req,res,next){
    var rep = JSON.stringify(req);
res.send(rep);    
    
    
//  fs.writeFile(process.env.OPENSHIFT_DATA_DIR+'message.txt', 'Hello Node je te souhaite la bienvenu mon copain', function (err) {
//     if(err){
//         res.send(err);
//     } else { 
//         res.send('uploaded');
//     }
// });
   
})
.get('/message.txt', function(req,res,next) {
    res.sendFile(process.env.OPENSHIFT_DATA_DIR+'message.txt'); 
});

module.exports = router;