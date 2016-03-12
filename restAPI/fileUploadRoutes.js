'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var fs = require('fs');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.post('/upload/file',function(res,req,next){
    
res.send(" ");
 
//  fs.writeFile(process.env.OPENSHIFT_DATA_DIR + 'message.txt', 'Hello Node', function (err) {
//     if(err){
//         res.send(err);
//     } else { 
//         res.send('uploaded');
//     }
// });
   
});

module.exports = router;