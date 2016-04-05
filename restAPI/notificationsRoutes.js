'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));


var notificationsDb = require('../database/notificaitonsDb');


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
.get('/:userid', function(req,res,next) {
    var userid = req.params.userid;
    var userNotifications = {};
    
    if(userid !== '') {
         notificationsDb.forEach(function(notif) {
            if(notif.userid === userid) {
                userNotifications = notif.notifications;   
            }
         }, this); 
        res.json(userNotifications);
    } else {
        res.status(403).send('user id malformed');
    }   
})
.get('/:userid/unread',function(req,res,next) {
    var userid = req.params.userid;
    var userNotifications = [];
    
   if(userid !== '') {
         notificationsDb.forEach(function(notif) {
            if(notif.userid === userid ) {
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
    
    var userid = req.body.userid !== undefined ? req.body.userid :  '';
    var notificationData = req.body.notificationData !== undefined ? req.body.notificationData : '';
    
    if(userid !== '' && notificationData !== ''){
        var userNotifications = getUserNotifications(userid);
        
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
                                    'userid':userid, 
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

.post('markasread/:userid/', function(req,res,next) {
    
    var notifid = req.params.notificationid !== undefined ? req.params.notificationid : '';
    var userid = req.params.userid !== undefined ? req.params.userid : '';
    var notificationsIds = req.body.notificationsIds !== undefined ? req.body.notificationsIds : ''; 
      
    if(notifid !== '' && userid !== '' && notificationsIds !== '') {
        
        var userNotifications = getUserNotifications(userid);
        // we mark as read all notification that are in the request
        if(JSON.stringify(userNotifications) !== '{}' ) {
             userNotifications.forEach(function(notification) {
                if(notificationsIds.indexOf(notification) >0 ) {
                    notification.read = true;
                }
             }, this);
        }       
           
    } else{
        res.status(403).send('request malformed');
    }
    
})

module.exports = router;
    
    
