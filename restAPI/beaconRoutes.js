'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

//stub of data;
// should be replace by a real database
var beaconDbStub = [
    { 
       idBeacon:'a123',
       associatedPlace:'gare mont-parnasse',
       longitude : 2.31,
       latitude  : 48.8
    },
    {
       idBeacon:'b345',
       associatedPlace : 'train Nantes-Paris',
       longitude: 0.0,
       latitude : 0.0 
    }
]

/**
 * ======= functions utilities =============================
 */

//function message and http status handling
function error(message,status) {
    var err = new Error(message);
    err.status;    
    return err;
}

//function to retrieve a beacon in beaconDbStub by its id 
function getBeacon(id) {
    var beacon;
    beaconDbStub.forEach(function(element) {
        if(element.idBeacon === id ) {
            beacon = element;
        }
     }, this);  
    return beacon;
}

//function to update beacon if a body parameter is set 
function updateBeacon(beacon,reqBody) {
    var beaconIndex = beaconDbStub.lastIndexOf(beacon);
    if (reqBody) {
        
       for (var params in reqBody) {
           // we avoid to insert non existing property 
            if( params && params !== '' && beacon[params] !== undefined ) {
                beacon[params] = reqBody[params];
            }
        }     
        beaconDbStub[beaconIndex] = beacon;    
    }
    return beacon;
}

// function to create beacon with required params if exist
function createBeacon(reqBody){
    var beacon={};
    //we take the first occurence to have the data model 
    var model = beaconDbStub[0];
     
    if (reqBody){
        for (var params in model) {
            
            if (reqBody[params] !== undefined) {
                beacon[params] = reqBody[params];
            }else if(Number.isInteger(model[params])){
                beacon[params]=0;
            }else if (Number.isFloat(model[params])){
                beacon[params]=0.0;
            }else{
                beacon[params]= '';
            }
        }      
      beaconDbStub.push(beacon);   
    }
    return beacon ;
}

/**
 * ======= all routes for the beacon =============================
 */

/**
 * get function to retrieve all beacons from the database
 */
router.get('/', function(req,res,next) {
    res.json(beaconDbStub);
})

/**
 * get function to retrieve one beacon by its id
 */
.get('/:id', function(req,res,next) {
   var id = req.params.id
       
    if (id && id !== undefined) {
        var beacon=getBeacon(id);
                    
        if(beacon) {
            res.json(beacon);
        } else {
            res.status(404).send('beacon not found');
        }
    
    } else {
       res.status(503).send('id isn\'t an integer or is undefined in the request');       
    }
})

/**
 * get function to retrieve a place from a beacon id
 */
.get('/:id/place/',function(req,res,next) {
   var id = req.params.id
       
    if (id && id !== undefined) {
        var beacon=getBeacon(id);
                    
        if(beacon) {
            res.json({place:beacon.associatedPlace});
        } else {
            res.status(404).send('beacon not found');
        }
    
    } else {
       res.status(503).send('id isn\'t an integer or is undefined in the request');       
    }
})

/**
 * post function to update beacon informations
 */
.post('/:id', function(req,res,next) {
   var id = req.params.id
    
    if ( id && id !== undefined ) {
        var beacon= getBeacon(id);
        var reqBody = req.body;
               
        if( beacon ) {        
            beacon = updateBeacon(beacon,reqBody);
            res.send(beacon);        
        } else {
            res.status(404).send('beacon not found');
        }
        
     } else {
       res.status(503).send('id is undefined in the request');       
    }    
})

/**
 * put function to create a beacon 
 * 
 * we start to check if there is an existing beacon 
 * otherwise we create him in the database
 */
.put('/', function(req,res,next) {
    var reqBody = req.body;
    var id = reqBody.idBeacon;
    
    if ( id !== undefined  && id !== '') {
       var beacon = getBeacon(id);
       
        if ( !beacon  && beacon === undefined) {//we create the beacon
           // check the parameters and put in the  db.
            var created = createBeacon(reqBody);
            if( created ) {
                res.send(created);
            }else{
                res.status(504).send('beacon creation issue');
            }
        } else { // we update the beacon
            updateBeacon(beacon,reqBody);
            res.send();
       }
       
    } else {
       res.status(503).send('id is undefined in the request');
    }
})

/**
 * delete function that remove beacon entry in the db  
 */
.delete('/:id', function(req,res,next){
   var id = req.params.id

    if ( id !== undefined ) {
       var beacon = getBeacon(id);
       
       if(beacon){
            beacon = beaconDbStub.splice(beaconDbStub.lastIndexOf(beacon),1);
            res.send(beacon);
       } else {
            res.status(404).send('beacon not found');
        }
    } else {
        res.status(503).send('id is undefined in the request');
    }
});

module.exports = router;