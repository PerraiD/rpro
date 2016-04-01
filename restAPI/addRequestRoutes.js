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
.get('/status/:userId1/:userId2',function(req,res,next) {
    var status = '';
    var userId1 = req.params.userId1 !== undefined ? req.params.userId1.replace(/"/g,"") : '' ;
    var userId2 = req.params.userId2 !== undefined ? req.params.userId2.replace(/"/g,"") : '' ; 
    
    
    if(userId1 && userId1 !== '' && userId2 && userId2 !== '') {
        addRequestDb.forEach(function(relation) {
            if(relation.userAskingId === userId1 && relation.userAskedId === userId2){
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
    var userId1 = req.body.userId1 !== undefined ? req.body.userId1 : '' ;
    var userId2 = req.body.userId2 !== undefined ? req.body.userId2 : '' ;
    
    if(userId1 && userId1 !== '' && userId2 && userId2 !== '') {
        
        //we push the new askRequest
        addRequestDb.push({userAskingId:userId1, userAskedId:userId2, status: 'waiting'});
        
        
        // we create the curl request to prevent user. 
        var user1= getUser(userId1);
        var user2= getUser(userId2);
        
        if(userId2.tokenDevice !== '') {
            var notificationBody ={
                user : user1,
                type : 'addingRequest'
            } 
             sendPushNotification([user2.tokenDevice],"Nouvelle invitation",user1.firstName +" "+user1.lastName +' vous invite', notificationBody);
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
    var userId1 = req.body.userId1 !== undefined ? req.body.userId1 : '' ;
    var userId2 = req.body.userId2 !== undefined ? req.body.userId2 : '' ;
    
    if( userId1 !== ''  && userId2 !== '' && response !== '') {
        var relation= getAddRequestFor(userId1, userId2);
        var userAsking = getUser(userId1);
        var userAsked = getUser(userId2);
        
        if (response === 'accepted') {
            // we add each user in the contact list of each user 
            userDb.forEach(function(user) {
                if(user.id === userId1){
                    
                    user.contacts.push(userId2);
                    
                }else if(user.id === userId2) {
                    
                    user.contacts.push(userId1)
                }
            }, this);    
          // we change de add request status 
            relation.status= 'accepted';
            sendPushNotification([userAsking.tokenDevice],"Invitation",userAsked.firstName+" "+ userAsked.lastName + "a accepté votre invitation")
            res.status(200).send();                                
        } else if (response === 'refused') {
           addRequestDb.slice(addRequestDb.indexOf(relation),1);
           res.status(200).send();
        }else{
            res.status(403).send('no response sended');
        }        
           
    }else{
        res.status(403).send('error request malformed');
    }  
})

.delete('/', function(req,res,next) {
    
    var userId1 = req.body.userId1 !== undefined ? req.body.userId1 : '' ;
    var userId2 = req.body.userId2 !== undefined ? req.body.userId2 : '' ;
    var returnedRequest = {};
    
    if( userId1 !== ''  && userId2 !== '') {
        var index=addRequestDb.map(function(x){
                                       return (x.userAskingId === userId1 && x.userAskedId === userId2)
                                   })
                    .indexOf(true);
        returnedRequest = addRequestDb.splice(index,1);
        console.log(returnedRequest);            
    }
    
     res.json(returnedRequest);
});    

module.exports = router;