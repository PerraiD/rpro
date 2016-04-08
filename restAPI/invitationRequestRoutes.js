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
var invitationRequestDb = require('../database/invitationRequestDb');
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

function getInvitationRequestFor(userAsking, userAsked) {
    var addRequest = {};
    invitationRequestDb.forEach(function(relation) {
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
    
   
}
//TODO : using this for debuging otherwise it should be deleted in production
router.get('/', function(req,res,next){
    res.json(invitationRequestDb);
})
/**
 * get function to get all invitation request  for userId
 */
.get('/:userId', function(req,res,next) {
    
    var userId = req.params.userId === '' ?   ''  :   req.params.userId;
    
    var invitationRequests = [];
    if (userId && userId !== '') {
        invitationRequestDb.forEach(function(request) {
            if(request.userAskingId == userId) {
                invitationRequests.push(request);
            }   
        }, this);
        
        res.json(invitationRequests);
        
    }else{
        res.status(403).send('error userIds malformed'); 
    }
})
/**
 * get function to get all waiting add request for userId 
 */
.get('/waiting/:userId', function(req,res,next) {
    
    var userId = req.params.userId === undefined ?  '' : req.params.userId; 
    var invitationRequests = [];
    if (userId && userId !== '') {
        invitationRequestDb.forEach(function(request) {
            if(request.userAskingId === userId && request.status === 'waiting') {
                invitationRequests.push(request);
            }   
        }, this);
        
        res.json(invitationRequests);
        
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
        invitationRequestDb.forEach(function(relation) {
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
.put('/invite/', function(req,res,next) {
    
    var status  = 'waiting';
    var userAskingId = req.body.userAskingId !== undefined ? req.body.userAskingId : '' ;
    var userAskedId = req.body.userAskedId !== undefined ? req.body.userAskedId : '' ;
    var message = req.body.message !== undefined ? req.body.message : '';
    var place = req.body.place !== undefined ? req.body.place : {};
    
    if(userAskingId !== '' && userAskedId !== ''  &&  place !== '') {
        
        //we push the new invitationRequest
        invitationRequestDb.push(   { userAskingId:userAskingId, 
                                      userAskedId:userAskedId, 
                                      message : message,
                                      place: place,
                                      status: 'waiting'});
               
        var userAsking = getUser(userAskingId);
        var userAsked  = getUser(userAskedId);
        
        if(userAsked.tokenDevice !== '') {
            
            var notificationBody = {
                    'id': utils.notifications.generateIdFor(userAsked.id),
                    'read': false,
                    'from': userAsking,
                    'type':'invitationRequest',
                    'data': {'message': message, 'place' : place},
                    'dateTime': Date.now()
            }                      
            
            sendPushNotification([userAsked.tokenDevice],"Nouvelle invitation",userAsking.firstName +" "+userAsking.lastName +' vous invite', notificationBody);
            
            var notificationToStore = {                
                'userId': userAsked.id,
                'notificationData': notificationBody              
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
 */
.post('/response/', function(req,res,next) {
    
    var response  = req.body.response  !== undefined ? req.body.response : '';
    var userAskingId = req.body.userAskingId !== undefined ? req.body.userAskingId : '' ;
    var userAskedId = req.body.userAskedId !== undefined ? req.body.userAskedId : '' ;
    var message = req.body.message !== undefined ? req.body.message : '';
    var place = req.body.place !== undefined ? req.body.place : {};
    
    if(userAskingId !== '' && userAskedId !== '' &&  place !== '') {
        var relation = getInvitationRequestFor(userAskingId, userAskedId);
        var userAsking = getUser(userAskingId);
        var userAsked = getUser(userAskedId);
        
        if (response === 'accepted') {
            if(JSON.stringify(relation) !== '{}'){
                 
                if(relation.status !== 'accepted') {
                    
                    relation.status = 'accepted';
                    
                    var notificationBody = {
                            'id': utils.notifications.generateIdFor(userAsking.id),
                            'read': false,
                            'from': userAsked,
                            'type':'invitationRequestResponse',
                            'data': {'message': message, 'place' : place},
                            'dateTime': Date.now()
                        
                    } 
                    sendPushNotification([userAsking.tokenDevice],"Invitation",userAsked.firstName+" "+ userAsked.lastName + " a accepté votre invitation",notificationBody)
                    
                    var notificationToStore = {                
                        'userId': userAsking.id,
                        'notificationData': notificationBody
                    }
            
                    utils.notifications.storeNotification(notificationToStore); 
                    
                    res.status(200).send();   
                } 
                
            }else{
                res.status(403).send('invitationRequest doesn\'t exist');
            }                             
        } else if (response === 'refused') {
           invitationRequestDb.splice(invitationRequestDb.indexOf(relation),1);
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
        var index=invitationRequestDb.map(function(x){
                                       return (x.userAskingId === userAskingId && x.userAskedId === userAskedId)
                                   })
                    .indexOf(true);
        returnedRequest = invitationRequestDb.splice(index,1);
        console.log(returnedRequest);            
    }
    
     res.json(returnedRequest);
});    

module.exports = router;