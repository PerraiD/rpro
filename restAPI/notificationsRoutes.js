'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));


var notificationsDb = require('../database/notificationsDb');


function getUserNotifications(id) {
    var userNotifications = {};
    notificationsDb.forEach(function(element) {
        if(element.userId === id){
            userNotifications = element;
        }
    }, this);
    
    return userNotifications;
}

function getNotificationFrom(notifications,id) {
   var notif = {};
   notifications.forEach(function(notification) {
       if(notification.id === id) {
           notif = notification;
       }
   }, this); 
   
   return notif;
}

router.get('/', function(req,res,next) {
    res.json(notificationsDb);
})
/**
 * get notifications for the user id 
 */
.get('/:userId', function(req,res,next) {
    var userId = req.params.userId;
    var userNotifications = [];
    
    if(userId !== '') {
         notificationsDb.forEach(function(notif) {
            if(notif.userId === userId) {
                userNotifications = notif.notifications;   
            }
         }, this); 
        res.json(userNotifications);
    } else {
        res.status(403).send('user id malformed');
    }   
})
.get('/:userid/unread',function(req,res,next) {
    var userId = req.params.userid;
    var userNotifications = [];
    
   if(userId !== '') {
         notificationsDb.forEach(function(notif) {
            if(notif.userId === userId ) {
                notif.notifications.forEach(function(notification) { // we keep only notification that is not readed
                    if(notification.read === false) {
                        userNotifications.push(notification);
                    }
                }, this);;   
            }
         }, this); 
        res.json(userNotifications);
    } else {
        res.status(403).send('user id malformed');
    }   
})

/**
 *  1/ check if the user has already a structure for notifications 
 *     -> if yes adding notifications to it 
 *     -> otherwise create structure.
 */
.put('/',function(req, res, next) {
    
    var userId = req.body.userId !== undefined ? req.body.userId :  '';
    var notificationData = req.body.notificationData !== undefined ? req.body.notificationData : '';
    
    if(userId !== '' && notificationData !== ''){
        var userNotifications = getUserNotifications(userId);
        
        if(JSON.stringify(userNotifications) !== '{}') {
            
            userNotifications.notifications.push({
                                    'id' : userNotifications.notifications.length + 1, // we increment the id
                                    'read':false,
                                    'from':notificationData.from,
                                    'type':notificationData.type,
                                    'data':notificationData.data,
                                    'dateTime':notificationData.dateTime       
                                    });
            res.send('ok');
        }else{
            
            notificationsDb.push({
                                    'userId':userId, 
                                    'notifications':[
                                        {
                                            'id': 1, // this is the first notifications 
                                            'read':false,
                                            'from':notificationData.from,
                                            'type':notificationData.type,
                                            'data':notificationData.data,
                                            'dateTime':notificationData.dateTime
                                        }
                                    ],
                                   });
            res.send('ok');                                   
        }        
    }else{
        res.status(403).send('request malformed');
    }
   
})

/**
 * post function that mark one or more notifications as read
 * 
 */

.post('markasread/:userId/', function(req,res,next) {
    
    var userId = req.params.userId !== undefined ? req.params.userId : '';
    var notificationsIds = req.body.notificationsIds !== undefined ? req.body.notificationsIds : ''; 
      
    if( userId !== '' && notificationsIds !== '') {
        
        var userNotifications = getUserNotifications(userId);
        // we mark all request notifications as read 
        if(JSON.stringify(userNotifications) !== '{}' ) {
             userNotifications.forEach(function(notification) {
                if(notificationsIds.indexOf(notification) > 0 ) {
                    notification.read = true;
                }
             }, this);
        }       
           
    } else{
        res.status(403).send('request malformed');
    }
    
})

/**
 * Delete function that delete all entry in notificationsDb
 * function that have to be delete !!!
 * use it only on the development
 * 
 */
.delete('/', function(req,res,next){
    notificationsDb = [];
    res.send();
})

module.exports = router;
    
    
