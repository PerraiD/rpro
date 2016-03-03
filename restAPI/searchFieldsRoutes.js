'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));


var sfdb = require('../database/searchFieldsDb');
var userDb = require('../database/userDb');

router.get('/', function(req,res,next){
    res.json(sfdb);
})
// TODO : REMOVE IT IN PROD
/**
 * get function to feed the database with data 
 * use it each time you relaunch the db instance on openshift  
 * */ 
.get('/supply', function(req,res,next){

       
    // we feed the db with users data 
    userDb.forEach(function(user) {
        
        if(sfdb.industry.indexOf(user.industry) < 0) {
            sfdb.industry.push(user.industry);
        }
        
        if(sfdb.company.indexOf(user.positions.values[0].company.name) < 0) {
            sfdb.company.push(user.positions.values[0].company.name);
        }
        
        if(sfdb.location.indexOf(user.location.name) < 0) {
            sfdb.location.push(user.location.name);
        }
        
        if(sfdb.place.indexOf(user.place.associatedPlace) < 0) {
            if(user.place.associatedPlace !== 'Inconnu') {
                 sfdb.place.push(user.place.associatedPlace);
            }           
        }
        
    }, this);


    res.send(sfdb);
})

module.exports = router;