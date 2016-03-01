'use strict';

var express         = require('express');
var bodyParser      = require('body-parser');
var router          = express.Router();
var sha1            = require('sha1');
var extractor       = require('keyword-extractor');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

//user and suggestion databases stub 
// !!! take care if you take subvalues from one of theses variables ,they will be created by reference 
// so if you modify subvalues they will be modify in theses variables !!
var userDbStub = require('../database/userDb');
var suggestDb = require('../database/suggestionDb');

// global variable editable for the computeCompatibilities function 
// ponderation shouldn't exceed 1 , they can if sum(ponderations) === number of ponderations
var ponderation = {industry : 1.25, location : 1, company : 1.5 , summary : 0.5, headline : 0.75}

// matching pourcentage to get a user to be compatible with an other,
// this pourcentage is >= 50
var pourcentageMin = 50;

// number of suggestion to be show in the application
// also represent the number of suggestion by rotation
var rotationSize = 10;

/**
 * ======= functions utilities =============================
 */

/**
 * function message and http status handling
 * @return error object 
 */
function error(message,status) {
    var err = new Error(message);
    err.status;    
    return err;
}



/**
 * function to retrieve user in userStub by its id
 * @param id of the user , res the response request
 * @return user  object
 */
function getUser(id,res) {
     var user;
     if ( id && id !== '' && id !== undefined )  {
        userDbStub.forEach(function(element) {
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
 *function to update user if a body parameter is set 
 * @return user object updated 
 */

function updateUser(userFound,reqBody) {
    var userIndex = userDbStub.lastIndexOf(userFound);
    
    if (reqBody) {
        
       for (var params in reqBody) {
           // we avoid to insert non existing property and avoir the modification of the id and password that it's forbbiden
            if( params && params !== '' && userFound[params] !== undefined && params !== 'id' && params !== 'password' ) {
                userFound[params] = reqBody[params];
            }
        }        
        userDbStub[userIndex] = userFound;    
    }
    return userFound;
}

/**
 * function to create user with required params if exist
 * @return new user object
 */
function createUser(reqBody,res){
    var user={};
    //we take the first occurence to have the data model 
    var model = userDbStub[0];
    if (reqBody && reqBody.emailAddress !== '' && reqBody.emailAddress !== undefined){
        // we check if the email not already exist
        var emailExist = false;
        userDbStub.forEach(function(user) {
            if(user.emailAddress === reqBody.emailAddress){
                emailExist = true;
            }    
        }, this);
        
        if(emailExist){
          res.status(403).send('user already exist with this email');  
        }else{        
            for (var params in model) {
                        
                if (reqBody[params] !== undefined) {
                    if(params === 'password') {
                        user[params] = sha1(reqBody[params]);
                    }else{
                        user[params] = reqBody[params];
                    }              
                }else if(Number.isInteger(model[params])) {
                    user[params]=0;
                }else if(Array.isArray(model[params])){
                    user[params]=[];
                } else if(typeof model[params] === "object") {
                    user[params]={};
                }else{
                    user[params]= '';
                }
            }
      userDbStub.push(user);
      }            
    }else{
        res.status(403).send('user email not defined');
    }
    return user ;
}

/**
 * function to update user password
 */

function updatePassword(user,password) {
      var userIndex = userDbStub.lastIndexOf(user);

      if (password !== '' && password !== undefined) {
          user.password = sha1(password);
          userDbStub[userIndex] = user;
      }
      
      return user;
}

/**
 * function to check if user already contain a user 
 */

function contactExist(user,userToCheck) {
  var exist = false;
    user.contacts.forEach(function(contactId) {
        if ((contactId.id !== undefined &&  userToCheck.id !== undefined)  && contactId.id === userToCheck.id) {
            exist = true;
        }
    }, this);
    
    return exist;
} 

/**
 * function to delete contact from user 
 */
function deleteContact(user,contactId) {
    var userObject = {id:contactId.id}
    var contactindex = user.contacts.lastIndexOf(userObject);
    if(contactindex){
      user.contacts.splice(contactindex,1);     
    }
    return user;
}

/**
 * function to get a user by its email for the authentification
 */

function getAuthUser(req,res){
    var email = req.body.emailAddress;
    var userAuth = {};
    
    if(email && email !== '' && email !== undefined) {
        userDbStub.forEach(function(user) {
            if(user.emailAddress === email) {
               userAuth = user;
            }      
     }, this);
    }else{
        res.status(401).send('email not defined');
    }
    return userAuth;   
}

/**
 * function to get suggestion list for user 
 */
function getUserSuggestion(user) {
    var suggestions = {};
    
    suggestDb.forEach(function(suggest) {
        if(suggest.userId === user.id){
            suggestions = suggest;                  
        }
    }, this);
    
    return suggestions;
}


/**
 * function to get Possible compatible user
 *  we avoid contacts that are already in user.contacts
 *   possibleCompatibleUser = userDb - (self.contacts + self.id)
 */

function getPossibleCompatibleUsers(user) {
    var users = [];
 
    userDbStub.forEach(function(dbUser) {
            
        var userIndex = user.contacts.map(function(x) {return x.id; }).indexOf(dbUser.id);

        if( !(userIndex>-1) && user.id !== dbUser.id){
            users.push(dbUser);
        }
    }, this); 
   
    return users;   
}

/**
 * function to test compatibility between string based on keywords extactor lirbrary
 * if there is at least a key word in common the txtfieldCompatibility return 1 otherwise 0;   
 * 
 * language : is a string to set the right language for the fieds  
 */
function txtfieldCompatibily(field1, field2, language){
    var compatibility = 0;
    
     // getting two lists of keywords;
    var field1Kwords = extractor.extract(field1,{language: language, remove_digits: true, return_changed_case: true, remove_duplicates: true });
    
    var field2Kwords = extractor.extract(field2,{language: language, remove_digits: true, return_changed_case: true, remove_duplicates: true });
    
    // we now check if there is keywords in common 
    
    field1Kwords.forEach(function(words) {
        if(field2Kwords.indexOf(words) > -1){
            compatibility = 1;
        }
    }, this);
    
    return compatibility;
}

/**
 * function to compute the compatibility between user object and possibleUsers array
 * return a suggestObj for the user; 
 */
function computeCompatibility(user,possibleUsers) {
    // maximum pourcentage with those ponderation => 100
    // ponderation shouldn't exceed 1 , they can if sum(ponderations) === number of ponderations
       

    var compatibilities = [];
    
    // we now determine  criterias in commun
    possibleUsers.forEach(function(possibleUser) {
        var pourcentage = 0;
        
        // criterias value = 0 or 1 
        var criterias = {
                industry : txtfieldCompatibily(user.industry, possibleUser.industry,'english'),
                summary  : txtfieldCompatibily(user.positions.values[0].summary, possibleUser.positions.values[0].summary,'french'),
                headline : txtfieldCompatibily(user.headline, possibleUser.headline,'french'),
                // we want exact same location not just based on a word in common
                location : user.location.name === possibleUser.location.name ? 1 : 0,
                company  : user.positions.values[0].company.name === possibleUser.positions.values[0].company.name ? 1 : 0    
        }
               
           
        for(var params in ponderation){
            pourcentage += (100/Object.keys(ponderation).length)*(ponderation[params]*criterias[params]);
        }
        console.log(pourcentage+'% '+possibleUser.id + ': '+criterias);
        
        // we put compatibility under a pourcentageMin condition (see the top of this file)
        if(pourcentage >= pourcentageMin) {
            compatibilities.push({
                                userId : possibleUser.id,
                                pourcentage : pourcentage 
                             });
        }
        
    }, this);

    return compatibilities;
}

/**
 * function that rotate on the suggestions structure for the user to get a new list of subjections each time
 * @ return suggestions list with users datas; 
 * */
function rotateSuggestion(suggestions){
    
    var usersSuggested = [];
    var suggestLength  = suggestions.compatibleUsers.length;
    var cptblUsers     = suggestions.compatibleUsers;
     
    //we check there is enought suggestions to do a rotation on suggestions
    // rotation frame is greater than the number of suggested user so we suggest all
    if(rotationSize >= suggestLength) {
        cptblUsers.forEach(function(userSugg) {
            usersSuggested.push(getUser(userSugg.userId,null));
       }, this);                                                                                                                                                                                                                                                                                       
    
    // rotation frame is lesser than the number of suggested user we rotate 
    } else {
        var indexDiff = suggestLength - (suggestions.rotationIndex + rotationSize);

        if(indexDiff >= 0) {
            for (var i = suggestions.rotationIndex ; i < suggestions.rotationIndex + rotationSize; i++) {
                usersSuggested.push(getUser(cptblUsers[i].userId,null));                
            }
            
            suggestions.rotationIndex = suggestions.rotationIndex + rotationSize; // DB UPDATE BY REFERENCES
        } else {      
           //we push the last element of the structure to be suggested
           for (var i = suggestions.rotationIndex; i < suggestLength; i++) {
                usersSuggested.push(getUser(cptblUsers[i].userId,null));              
           }
           //we come back to the beginning of the structure
           var cptblFIndex = 0; 

           for (var i = cptblFIndex; i < -indexDiff ; i++) {
                usersSuggested.push(getUser(cptblUsers[i].userId,null));              
           }
           //we update to replace the index
           suggestions.rotationIndex = -indexDiff; // DB UPDATE BY REFERENCES
        }   
        
    }
    
    //return suggestDb;
    return usersSuggested;
}

/**=============================================================
 * ======= all routes for the user =============================
 *///===========================================================

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
     var user = getUser(req.params.id,res);
     res.json(user);
})

/**
 * TODO : Improve this function to get user not just id list
 * get function to get all contacts from a user 
 */
.get('/:id/contacts/',function(req,res,next){
    var user = getUser(req.params.id,res);
    if(user){
         res.json(user.contacts);
    }
   
})

/**
 * get function to get a user by its id that is in contact list from a user id 
 */
.get('/:id/contact/:contactId',function(req,res,next){
    var user = getUser(req.params.id,res);
    var contact={};
    
    if(user !== undefined){
        user.contacts.forEach(function(contactId) {
         if(contactId.id == req.params.contactId){
             contact = getUser(contactId.id,res);
         }
     }, this);
     
     if(contact && JSON.stringify(contact) !== '{}') {
        res.json(contact);
     } else {
         res.status(404).send('user not found');
     }
    }
    
    
})

/**
 * get function that provide contact suggestion for the user 
 */

.get('/:id/suggest', function(req,res,next){
    var id = req.params.id;
    
    var user = getUser(id,res);
    var suggestions = getUserSuggestion(user); // suggestions already defined.
    var possibleUsers = getPossibleCompatibleUsers(user); // users that are involved in the suggestion.
   
    // we check if user  have a suggestion list we don't recompute all users just users that doesn't exist
    if(JSON.stringify(suggestions) !== '{}') {
        
        // we check if there is users to add in the suggestion 
        if( suggestions.compatibleUsers.length < possibleUsers.length ) {
           
           // we get a sub-structure
            var missingSuggest = []; 
            possibleUsers.forEach(function(pUser) {
                               
               var  userindex = suggestions.compatibleUsers.map(function(x) {return x.userId; }).indexOf(pUser.id);
                              
                if( userindex < 0 ){                                   
                    missingSuggest.push(pUser);
                }
                
            }, this);
            
             // compute the pourcentage compatibility that has not defined in the suggestion user table;
            var computedComp = computeCompatibility(user,missingSuggest);
            // we push new values into suggestion local var (the database update is inplicite because of the reference copy)

            computedComp.forEach(function(sugg) {
                suggestions.compatibleUsers.push(sugg);
            }, this);
  
        }
    // we create the suggestion structure for the user if she doesn't exist               
    } else {       
       // compute all possibleUsers with data to get pourcentage of compability
        suggestions = {userId:user.id,rotationIndex:0,compatibleUsers:computeCompatibility(user,possibleUsers)};
        // we push in the database the new set of data
        suggestDb.push(suggestions);
    }
       
       res.send(rotateSuggestion(suggestions));           
})

/**
 * function to authenticate user 
 */
.post('/authenticate',function(req,res,next) {
    var user = getAuthUser(req,res);
    if (user && JSON.stringify(user) !== '{}' && user.password === sha1(req.body.password)) {
        
        res.json(user);
    } else {
        
        res.status(401).send('authentification fail');
    }
      
})
/**
 * post function to update user informations
 */
.post('/:id', function(req,res,next) {
    var user = getUser(req.params.id,res);
    if(user && JSON.stringify(user) !== '{}') {
        user =  updateUser(user,req.body);
        res.json(user);   
    }  
})

/**
 * post function to update password user 
 */
.post('/:id/pass', function(req,res,next){
    
    var user = getUser(req.params.id,res);
    if(user && JSON.stringify(user) !== '{}') {
        var newPass = req.body.password;
        user =  updatePassword(user,newPass);
        res.json(user);           
    }
      
})

/**
 * post function to adding a contact in the list 
 * the body should be like {id:idFromUserToAdd}
 */
.post('/:id/contact/', function(req,res,next){
     var id = req.params === undefined ? undefined : req.params.id;
     var idToAdd = req.body === undefined ? undefined : req.body.id;
     var user;
     var userToAdd;
     
     if( id !== idToAdd) {
         user = getUser(id,res);
         userToAdd = getUser(idToAdd,res);
         
         //we check if the user doesn't already have userToAdd 
         if (user && userToAdd && !contactExist(user,userToAdd)) {
             user.contacts.push({id : userToAdd.id});
         }
         res.json(user);      
     }else{
         res.status(400).send('the user can\'t add itself as contact');
     }                     
})
/**
 * debug function to set rotationSize directly on openshift
 * !! TODO : DELETE THIS FUNCTION OR COMMENT IT IN PRODUCTION
 */
.post('/rotation/:nb',function(req,res,next){
    var rotation =  Number.parseInt(req.params.nb);
    if(req.params.nb && Number.isInteger(rotation)){
        rotationSize = rotation;
        res.send(''+rotationSize);
    }else{
        res.status(400).send('you have not send a number')
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
    var id = reqBody.id;
    var user = {};
    
    if ( id && id !== '') {
       //we check get the user if exist       
       userDbStub.forEach(function(dbUser) {
           if (dbUser.id === id) {
               user = dbUser;
           }
       }, this);
        if ( !user || JSON.stringify(user) === '{}') {//we create the user
           // check the parameters and put in the db.
            var created = createUser(reqBody,res);
            if( created  && JSON.stringify(created) !== '{}' ) {
                res.send(created);
            }else{
                res.status(504).send('user creation issue');
            }
        } else { // we update the user
           user = updateUser(user,reqBody);
           res.json(user);
       }
       
    } else {
       res.status(400).send('id isn\'t defined');
    }
})

/**
 * function to delete a user by its id
 */
.delete('/:id', function(req,res,next){
    var user = getUser(req.params.id,res);
    if(user && JSON.stringify(user) !=='{}'){
        
        user = userDbStub.splice(userDbStub.lastIndexOf(user),1);
        res.json(user);
    }
  
})
/**
 * function to delete a contact from a user 
 */
.delete('/:id/contact/:contactId',function(req,res,next){
     var user = getUser(req.params.id,res);
     var userToDel = getUser(req.params.contactId,res);
    
    if(user && userToDel && contactExist(user,userToDel)){
        user = deleteContact(user,userToDel);    
    }
    res.json(user);
});
module.exports = router;