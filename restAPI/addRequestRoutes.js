'use strict';
var request      = require('request');
var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

var userDb = require('../database/userDb');
var addRequestDb = require('../database/addRequestDb');
var utils = require('../utils/utils');

/**
 * function to retrieve user in userStub by its id
 * @param id of the user , res the response request
 * @return user  object
 */
function getUser(id,res) {
     var user;
     if ( id && id !== '' && id !== undefined )  {
        userDb.forEach(function(element) {
            if(element.id === id ) {
                user = element;
            }
        }, this); 
                    
        if( !user && user === undefined) {
            if(res != null){
                res.status(404).send('user not found');
            }else{
                console.log('user not found');
            }            
        }
    
    } else {
        if(res != null){
            res.status(401).send('id isn\'t defined');   
        }else{
            console.log('id isn\'t defined');
        }           
    }    
    return user;
}

/**
 * utility fonction
 * get add request for the userAsking and userAsked
 */

function getAddRequestFor(userAsking, userAsked) {
    var addRequest = {};
    addRequestDb.forEach(function(relation) {
        if(relation.userAskingId === userAsking && relation.userAskedId === userAsked){
            addRequest = relation; 
        }
    }, this);
    
    return addRequest;
}


/**
 * definition of the request for pushnotification
 * 
 */
function sendPushNotification(tokendevice,title,message,data) {
     
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
                "title": title,
                "message": message
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
    
   
}
//TODO : using this for debuging otherwise it should be deleted in production
router.get('/', function(req,res,next){
    res.json(addRequestDb);
})
/**
 * get function to get all add request  for userId
 */
.get('/:userId', function(req,res,next) {
    
    var userId = req.params.userId === '' ?   ''  :   req.params.userId;
    
    var addRequests = [];
    if (userId && userId !== '') {
        addRequestDb.forEach(function(request) {
            if(request.userAskingId == userId) {
                addRequests.push(request);
            }   
        }, this);
        
        res.json(addRequests);
        
    }else{
        res.status(403).send('error userIds malformed'); 
    }
})
/**
 * get function to get all waiting add request for userId 
 */
.get('/waiting/:userId', function(req,res,next) {
    
    var userId = req.params.userId === undefined ?  '' : req.params.userId; 
    var addRequests = [];
    if (userId && userId !== '') {
        addRequestDb.forEach(function(request) {
            if(request.userAskingId === userId && request.status === 'waiting') {
                addRequests.push(request);
            }   
        }, this);
        
        res.json(addRequests);
        
    }else{
        res.status(403).send('error userIds malformed'); 
    }
})
/**
 * get function to get status of an add request between userId1 and userId2
 */
.get('/status/:userAskingId/:userAskedId',function(req,res,next) {
    var status = '';
    var userAskingId = req.params.userAskingId !== undefined ? req.params.userAskingId.replace(/"/g,"") : '' ;
    var userAskedId = req.params.userAskedId !== undefined ? req.params.userAskedId.replace(/"/g,"") : '' ; 
    
    
    if(userAskingId && userAskingId !== '' && userAskedId && userAskedId !== '') {
        addRequestDb.forEach(function(relation) {
            // we ensure that if the two user can see the status 
            if( (relation.userAskingId === userAskingId && relation.userAskedId === userAskedId)
             || (relation.userAskingId === userAskedId && relation.userAskedId === userAskingId) ){
                status = relation.status; 
            }
        }, this);
        
        res.json({status:status});
        
    }else{
        res.status(403).send('error userIds malformed');
    }
})
/**
 * push function to push the invitation on the database
 * @return the status of the adding 
 */
.put('/adding/', function(req,res,next) {
    
    var status  = 'waiting';
    var userAskingId = req.body.userAskingId !== undefined ? req.body.userAskingId : '' ;
    var userAskedId = req.body.userAskedId !== undefined ? req.body.userAskedId : '' ;
    
    if(userAskingId && userAskingId !== '' && userAskedId && userAskedId !== '') {
        
        //we push the new askRequest
        addRequestDb.push({userAskingId:userAskingId, userAskedId:userAskedId, status: 'waiting'});
               
        var userAsking= getUser(userAskingId);
        var userAsked= getUser(userAskedId);
        
        if(userAsked.tokenDevice !== '') {
            
            var notificationBody = {
                    'id'      : utils.notifications.generateIdFor(userAsked.id),
                    'read'    : false,
                    'from'    : userAsking,
                    'type'    :'addingRequest',
                    'data'    : userAsking,
                    'dateTime': Date.now()
            }                      
            
            sendPushNotification([userAsked.tokenDevice],"Nouvelle invitation",userAsking.firstName +" "+userAsking.lastName +' vous invite', notificationBody);
            
            var notificationToStore = {                
                'userId': userAsked.id,
                'notificationData':  notificationBody                  
            }
            
            utils.notifications.storeNotification(notificationToStore);            
         }
       
        res.json({status:status});
        
    }else{
        res.status(403).send('error userIds malformed');
    }
})
/**
 * post function to send response to an add request 
 * delete the ask request and put user in the contact list of each user
 */
.post('/response/', function(req,res,next) {
    
    var response  = req.body.response  !== undefined ? req.body.response : '';
    var userAskingId = req.body.userAskingId !== undefined ? req.body.userAskingId : '' ;
    var userAskedId = req.body.userAskedId !== undefined ? req.body.userAskedId : '' ;
    
    if( userAskingId !== ''  && userAskedId !== '' && response !== '') {
        var relation= getAddRequestFor(userAskingId, userAskedId);
        var userAsking = getUser(userAskingId);
        var userAsked = getUser(userAskedId);
        
        if (response === 'accepted') {
            if(JSON.stringify(relation) !== '{}'){
                 
                if(relation.status !== 'accepted') {
                    // we add each user in the contact list of each user 
                    userAsking.contacts.push(userAskedId);
                    userAsked.contacts.push(userAskingId);
                    
                    relation.status = 'accepted';
                    
                    var notificationBody = {
                            'id'      : utils.notifications.generateIdFor(userAsking.id),
                            'read'    : false,
                            'from'    : userAsked,
                            'type'    :'addRequestResponse',
                            'data'    : userAsked,
                            'dateTime': Date.now()
                    }
                    sendPushNotification([userAsking.tokenDevice],"Invitation",userAsked.firstName+" "+ userAsked.lastName + "a accepté votre invitation",notificationBody)
                    
                    var notificationToStore = {                
                        'userId': userAsking.id,
                        'notificationData': notificationBody
                    }
            
                    utils.notifications.storeNotification(notificationToStore); 
                    
                    res.status(200).send();   
                } 
                
            }else{
                res.status(403).send('addrequest not exist');
            }                             
        } else if (response === 'refused') {
           addRequestDb.splice(addRequestDb.indexOf(relation),1);
           res.status(200).send();
        }else{
            res.status(403).send('no response sended');
        }        
           
    }else{
        res.status(403).send('error request malformed');
    }  
})

.delete('/', function(req,res,next) {
    
    var userAskingId = req.body.userAskingId !== undefined ? req.body.userAskingId : '' ;
    var userAskedId = req.body.userAskedId !== undefined ? req.body.userAskedId : '' ;
    var returnedRequest = {};
    
    if( userAskingId !== ''  && userAskedId !== '') {
        var index=addRequestDb.map(function(x){
                                       return (x.userAskingId === userAskingId && x.userAskedId === userAskedId)
                                   })
                    .indexOf(true);
        returnedRequest = addRequestDb.splice(index,1);
        console.log(returnedRequest);            
    }
    
     res.json(returnedRequest);
});    

module.exports = router;