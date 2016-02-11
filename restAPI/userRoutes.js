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
var userDbStub = [
    { 
       id:1,
       firstname:'john',
       lastname: 'doe',
       password: 'password'  // should have to be in shaone    
    },
    {
       id:2,
       firstname :'barb',
       lastname : 'dirt',
       password : 'password' // should have to be in shaone
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

//function to retrieve user in userStub by its id 
function getUser(id) {
    var user;
    userDbStub.forEach(function(element) {
        if(element.id === id ) {
            user = element;
        }
     }, this);  
    return user;
}

//function to update user if a body parameter is set 
function updateUser(userFound,reqBody) {
    var userIndex = userDbStub.lastIndexOf(userFound);
    
    if (reqBody) {
        
       for (var params in reqBody) {
           // we avoid to insert non existing property and avoir the modification of the id that it's forbbiden
            if( params && params !== '' && userFound[params] !== undefined && params !== 'id' ) {
                userFound[params] = reqBody[params];
            }
        }        
        userDbStub[userIndex] = userFound;    
    }
}

// function to create user with required params if exist
function createUser(reqBody){
    var user={};
    //we take the first occurence to have the data model 
    var model = userDbStub[0];
     
    if (reqBody){
        for (var params in model) {
            
            if (reqBody[params] !== undefined) {
                user[params] = reqBody[params];
            }else if(Number.isInteger(model[params])){
                user[params]=0;
            }else{
                user[params]= '';
            }
        }      
      userDbStub.push(user);   
    }
    return ( user !== {} ) ;
}

/**
 * ======= all routes for the user =============================
 */

/**
 * get function to retrieve all users from the database
 */
router.get('/', function(req,res,next) {
    res.json(userDbStub);
})

/**
 * get function to retrieve one user by its id
 */
.get('/:id', function(req,res,next) {
    var id = Number.parseInt(req.params.id);
       
    if (id && !Number.isNaN(id)) {
        var userFound=getUser(id);
                    
        if(userFound) {
            res.json(userFound);
        } else {
            res.status(404).send('user not found');
        }
    
    } else {
       res.status(503).send('id isn\'t an integer or is undefined in the request');       
    }
})

/**
 * post function to update user informations
 */
.post('/:id', function(req,res,next) {
    var id = Number.parseInt(req.params.id);
    
    if ( id && !Number.isNaN(id) ) {
        var user= getUser(id);
        var reqBody = req.body;
               
        if( user ) {        
            updateUser(user,reqBody);
            res.send();        
        } else {
            res.status(404).send('user not found');
        }
        
     } else {
       res.status(503).send('id isn\'t an integer or is undefined in the request');       
    }    
})

/**
 * put function to create a user 
 * 
 * we start to check if there is an existing user 
 * otherwise we create him in the database
 */
.put('/', function(req,res,next) {
    var reqBody = req.body;
    var id = Number.parseInt(reqBody.id);
    if ( !Number.isNaN(id) ) {
       var user = getUser(id);
       
        if ( !user ) {//we create the user
           // check the parameters and put in the  db.
            var created = createUser(reqBody);
            if( created ) {
                res.send();
            }else{
                res.status(504).send('user creation issue');
            }
        } else { // we update the user
            updateUser(user,reqBody);
            res.send();
       }
       
    } else {
       res.status(503).send('id isn\'t an integer or is undefined in the request');
    }
})
.delete('/:id', function(req,res,next){
    var id = Number.parseInt(req.params.id);

    if ( !Number.isNaN(id) ) {
       var user = getUser(id);
       
       if(user){
            userDbStub.splice(userDbStub.lastIndexOf(user),1);
            res.send();
       } else {
            res.status(404).send('user not found');
        }
    } else {
        res.status(503).send('id isn\'t an integer or is undefined in the request');
    }
});

module.exports = router;