'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

var userDb = require('../database/userDb');
var addRequestDb = require('../database/addRequestDb');


//TODO : using this for debuging otherwise it should be deleted in production
router.get('/', function(req,res,next){
    res.json(addRequestDb);
})
/**
 * get function to get all add request  for userId
 */
.get('/:userId', function(req,res,next) {
    var userId = req.params.userId; 
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
    var userId = req.params.userId; 
    var addRequests = [];
    if (userId && userId !== '') {
        addRequestDb.forEach(function(request) {
            if(request.userAskingId == userId && request.status == 'waiting') {
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
    var userId1 = req.params.userId1;
    var userId2 = req.params.userId2;
    
    if(userId1 && userId1 != '' && userId2 && userId2 != '') {
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
    
    var addRequestResp  = req.body.addRequestResp  !== undefined ? req.body.addRequestResp : '';
    var userId1 = req.body.userId1 !== undefined ? req.body.userId1 : '' ;
    var userId2 = req.body.userId2 !== undefined ? req.body.userId2 : '' ;
    
    if( userId1 !== ''  && userId2 !== '' && addRequestResp !== '') {
        
        if (addRequestResp === 'accepted') {
            // we add each user in the contact list of each user
            userDb.forEach(function(user) {
                if(user.id === userId1){
                    
                    user.contacts.push(userId2);
                    
                }else if(user.id === userId2) {
                    
                    user.contacts.push(userId1)
                }
            }, this);    
            //TODO DELETE ask request FROM THE DATABASE;
            
        } else if (addRequestResp === 'refused') {
            
        }else{
            res.status(403).send('no response sended');
        }        
           
    }else{
        res.status(403).send('error userIds malformed');
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