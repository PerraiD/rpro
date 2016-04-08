var notificationsDb = require('../database/notificationsDb');
var beaconDb = require('../database/beaconDb');

var utils = {
       notifications : {},
       beacons: {}
};

/**
 * =================== notification utils=================
 */

utils.notifications.getUserNotifications = function(id) {
    var userNotifications = {};
    notificationsDb.forEach(function(element) {
        if(element.userId === id){
            userNotifications = element;
        }
    }, this);
    
    return userNotifications;
}

/***
 * utilities function that generate id for a user
 * based on the last notification id + 1;
 */
utils.notifications.generateIdFor = function(userId) {
    
    var id = 1;
    
    notificationsDb.forEach(function(element) {
        if(element.userId === userId){
            id = element.notifications.length + 1;
        }
    }, this);
    
    return id;   
};

/**
 * utilities function that store the notification by user 
 */
utils.notifications.storeNotification = function(notification){
        
        var userNotifications = utils.notifications.getUserNotifications(notification.userId);
        
        // we check if the user have already a notification structure or not
        if(JSON.stringify(userNotifications) !== '{}') { 
            
            userNotifications.notifications.unshift(notification.notificationData);
            
        }else{
            
            notificationsDb.unshift({
                                    'userId': notification.userId, 
                                    'notifications':[
                                       notification.notificationData
                                    ],
                                   });                                 
        }             
}

/**
 * =================== notification utils=================
 */

utils.beacons.getBeaconPlaceFromId = function (placeId) {
    var place = '';
    beaconDb.forEach(function(beacon) {
        if(beacon.idBeacon === placeId) {
            place = beacon.associatedPlace;
        }
        
    }, this);
    
    return place;
}



module.exports = utils;