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

/**
 * definition of the request for pushnotification
 * 
 */
function sendPushNotification(tokendevice,title,message,data){
    
    // Define relevant info
    var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYjA0MDJhYS1hYTkyLTRiNTMtOTQwNS1hMzg3ODE2YjZlYjEifQ.a18d3wuYXKWdxutsydP4RVJ3-NJZS4BXjMnv8_psSAI';
    var tokens = tokendevice; //array
    var profile = 'rpro';

    // Build the request object
    var options = {
    method: 'POST',
    url: 'https://api.ionic.io/push/notifications',
    json:true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
    },
    body :{
        "tokens": tokens,
        "profile": profile,
        "notification": {
            "title": title,
            "message": message,
            "payload": data,
            "android": {
                "title": title,
                "message": message,
                "delay_while_idle": true,
                "priority":"high",
            },
            "ios": {
                "title": "Howdy",
                "message": "Hello iOS!"
            }
        }
    }
   
    };
         
   request(options, function (err, res, body) {
    if (err) {
        console.log('Error :' ,err)
        return
    }   
    console.log(' Body :', body)

});



router.post('/upload/file',upload.single('file'),function(req,res,next){    
    if(req.file !== undefined && req.file.path !== undefined) {
        var usersToPrevent = JSON.parse(req.body.users);
        
        var filename = req.file.originalname;
        fs.readFile(req.file.path, function (err, data) {
    
            var filePath = process.env.OPENSHIFT_DATA_DIR + filename;
            var url = "https://rpro-epic2.rhcloud.com/fileupload/"+filename;
            
            fs.writeFile(filePath, data, function (err) {
                if(err){
                    res.status(403).send(err);
                }else{
                    usersToPrevent.forEach(function(user) {
                        if(user.tokenDevice !== ''){
                            sendPushNotification(user.tokenDevice,'HUB de partage','Proposition de transfert de fichier'+filename,{'dlink':url});    
                        }                        
                    }, this);
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