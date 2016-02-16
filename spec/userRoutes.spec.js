var superTest= require('supertest');
var sha1 = require('sha1');
var server  = require('../server');
var rest = superTest.agent("http://localhost:8091");

/**
 * Note : to see stub data go to the file under test : userRoutes.js
 * some it() function are design to be in order , take care if you edit it 
 */
var user1 = { 
                id:'1',
                firstName:'john',
                lastName: 'doe',
                emailAddress : 'john.doe@mail.com',
                password: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
                headline : '',
                industry : '',
                pictureUrl : '',
                positions: [],
                specialties:'',
                contacts:[{
                    id:'2'
                }],
                place : []    
              }

var user2 = {
                id:'2',
                firstName :'barb',
                lastName : 'dirt',
                emailAddress : 'barb.dirt@mail.com',
                password : '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 
                headline : '',
                industry : '',
                pictureUrl : '',
                positions: [],
                specialties:'',
                contacts:[],
                place : []    
           }
           
var user3 = { 
                id:'6',
                firstName:'douglas',
                lastName: 'doe',
                emailAddress : 'douglas.doea@mail.com',
                password: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
                headline : '',
                industry : '',
                pictureUrl : '',
                positions: [],
                specialties:'',
                contacts:[],
                place : []    
              }

describe('PUT /user/', function() {
   
   it('respond with user object updated if user is already defined', function(done){
        var tmpuser = user3;
        tmpuser.password = 'password';
        
        rest.put('/user/')
        .send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).toEqual(user3);                    
        })
        .end(done);         
    });
    
    it('respond with new user Object if id and email is defined', function(done){
        rest.put('/user/')
        .send({id:'dazdsqre',emailAddress:'johndoe@mail.com'})
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(res.body.id).toEqual('dazdsqre');
            expect(res.body.emailAddress).toEquals('johndoe@mail.com');
            
        })
        .end(done);         
    });     
   
    it('respond with "user already exist with this email"  if id and email is defined but id not exist in the db', function(done){
        rest.put('/user/')
        .send({id:'1234', emailAddress:'john.doe@mail.com'})
        .expect(function(res) {
            expect(res.status).toBe(403);       
            expect(res.error.text).toEqual('user already exist with this email');
    
        })
        .end(done);         
    });
          
   it('respond "id isn\'t defined" if no id is defined', function(done){
        rest.put('/user/')
        .send({})
        .expect(function(res) {
            expect(res.status).toBe(400);       
            expect(req.error.text).toEqual('id isn\'t defined');
            
        })
        .end(done);         
    });

}); 

describe('POST /user/:id', function(){
    
     it('respond with "user not found " if  id isn\'t sended',function(done){
        rest.post('/user/\'\'')
        .send({}) 
        .expect(function(res) {
            
            expect(res.status).toBe(404);       
            expect(res.error.text).toEqual('user not found');
             
        })
        .end(done);         
    }); 
    
     it('respond with "user not found " if  id isn\'t found',function(done){
        rest.post('/user/234')
        .send({}) 
        .expect(function(res) {
            
            expect(res.status).toBe(404);       
            expect(res.error.text).toEqual('user not found');
             
        })
        .end(done);         
    });
    
    it('respond with user updated if id found and there is data to update', function(done){
        var usertmp = user3;
        usertmp.firstName = 'dani';
        usertmp.password = '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8';
        
        console.log(usertmp.password);
        rest.post('/user/6')
        .send({firstName:'dani'}) 
        .expect(function(res) {
            
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(usertmp);
             
        })
        .end(done);         
    });
    
    it('respond with user updated if id found and there is data to update but without changing password',function(done){
         var usertmp = user3;
         usertmp.firstName = 'toto';
        
        rest.post('/user/6')
        .send({firstName:'toto',password:'password'}) 
        .expect(function(res) {
            
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(usertmp);
             
        })
        .end(done);         
    });  
    
}); 

describe('POST /user/:id/pass/', function(){
     it('respond with user\'s password updated if id found and there is password to update',function(done){
        var usertmp = user3;
        usertmp.password = sha1('toto');
         
        rest.post('/user/6/pass')
        .send({password:'toto'}) 
        .expect(function(res) {
            
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(usertmp);
             
        })
        .end(done);         
    });
    
     it('respond with user not found if id doesn\'t exist',function(done){
        var usertmp = user3;
        usertmp.password = sha1('toto');
         
        rest.post('/user/19/pass')
        .send({password:'toto'}) 
        .expect(function(res) {
            
            expect(res.status).toBe(404);       
            expect(res.error.text).toEqual('user not found');
             
        })
        .end(done);         
    }); 
    
    it('respond with user without changing password if the password isn\'t send',function(done){
        var usertmp = user3;
         
        rest.post('/user/6/pass')
        .send({}) 
        .expect(function(res) {
            
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(usertmp);
             
        })
        .end(done);       
    });    

});

describe('POST user/:id/contact/',function(){
    
    it('respond with user with new contact user if the users id are define : one in params the contact id in the body', function(done){
        var usertmp = user3;
        usertmp.contacts.push({id:'2'});
         
        rest.post('/user/6/contact')
        .send({id:'2'}) 
        .expect(function(res) {
            
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(usertmp);
             
        })
        .end(done);       
    });
    
    it('respond with user without  new contact user if the users already have the contact in his list', function(done){
        var usertmp = user3;
         
        rest.post('/user/6/contact')
        .send({id:'2'}) 
        .expect(function(res) {
            
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(usertmp);
             
        })
        .end(done);       
    });
    
     it('respond with "id isn\'t defined" new contact user if the contact id isnot define in the body', function(done){
         
        rest.post('/user/6/contact')
        .send() 
        .expect(function(res) {
            
            expect(res.status).toBe(401);       
            expect(res.error.text).toEqual('id isn\'t defined');
             
        })
        .end(done);       
    });
    
    it('respond with "the user can\'t add itself as contact" if user and contact id are equal', function(done){
         
        rest.post('/user/6/contact')
        .send({id:'6'}) 
        .expect(function(res) {
            
            expect(res.status).toBe(400);       
            expect(res.error.text).toEqual('the user can\'t add itself as contact');
             
        })
        .end(done);       
    });
});

describe('GET /user',function() {
    
    it('respond with 4 users',function(done){
       rest.get('/user')
        .set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(200,done)
        .expect(function(res){
            expect(res.body.length).toBe(4);
        },done);    
    });
      
});

describe('GET /user/:id',function() {
    
     it('respond with 1 users if user exist',function(done){
       rest.get('/user/1')
        .set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(200,done)
        .expect(function(res){
            expect(res.body).not.toBeNull();
            expect(res.body).toEqual(user1);
        },done);    
    });
    
    it('respond with no users if user id doesn\'t exist in the db : numerical',function(done){
       rest.get('/user/3')
        .set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(404,done)
        .expect(function(res){
            expect(res.body).toBeNull();
        },done);    
    });
    
    it('respond with no users if user id doesn\'t exist in the db : String',function(done){
       rest.get('/user/dazedazezea')
        .set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(404,done)
        .expect(function(res){
            expect(res.body).toBeNull();
        },done);    
    });   
    
    it('respond with no users if user id doesn\'t exist : \'\'',function(done){
       rest.get('/user/\'\'')
        .set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(401,done)
        .expect(function(res){
            expect(res.body).toBeNull();
        },done);    
    });
       
});

describe('GET /user/:id/contacts',function() {
    
    
    it('respond with all contacts from a user if he has some', function(done){
        rest.get('/user/1/contacts/')
        .set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(200,done)
        .expect(function(res){
            expect(res.body).not.toBe(undefined);
            expect(res.body).toEqual([{id:'2'}]);
        },done);   
    });     
    
    it('respond nothing from a user if he doesnt have contacts', function(done){
        rest.get('/user/2/contacts/')
        .set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(401,done)
        .expect(function(res){
            expect(res.body).toBeNull();
        },done);   
    });    
     
    it('respond "user not found" if user id if false', function(){
        rest.get('/user/3/contacts/')

        .end(function(req,res){
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('user not found');
        });
    });      
       
});

describe('GET /user/:id/contact/:contactId', function() {
     it('respond a user if user have contact and have the id ', function(done){
         
         rest.get('/user/1/contact/2')
        .expect(function(res){ 
            expect(res.body.id).toEqual(user2.id);
        })
        .end(done);         
     });
     
     it('respond "user not found" if user id if false', function(done){
         
         rest.get('/user/3/contact/2')
        .expect(function(res){
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('user not found');
        })
        .end(done);         
     });
     
     it('respond "user not found" if contact id if false', function(done){
         
         rest.get('/user/1/contact/3')
        .expect(function(res){
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('user not found');
        })
        .end(done);         
     });
         
});



describe('POST /user/authenticate', function() {
    it('respond with the user information if authenticate success',function(done){
        
        rest.post('/user/authenticate') 
        .send({
               emailAddress:"john.doe@mail.com",
               password:"password" 
            })
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(user1); 
        })   
        .end(done);
    });
    
     it('respond with "email not defined" if email is unknown',function(done){
        rest.post('/user/authenticate') 
        .send({
               emailAddress:"johazdan.azdazd@mail.com",
               password:"password" 
            })
        .expect(function(res) {
            
            expect(res.status).toBe(401);       
            expect(res.err.text).toEqual('email not defined'); 
        })   
        .end(done);
    });
    
    it('respond with "authentification fail" if password is not good',function(done){
        rest.post('/user/authenticate') 
        .send({
               emailAddress:"john.doe@mail.com",
               password:"passwDREDADZ" 
            })
        .expect(function(res) {
            expect(res.status).toBe(401);       
            expect(res.error.text).toEqual('authentification fail'); 
        })   
        .end(done);
    });     
   
    it('respond with "email not defined" if any params is sended',function(done){
        rest.post('/user/authenticate')
        .send({}) 
        .expect(function(res) {
            
            expect(res.status).toBe(401);       
            expect(res.error.text).toEqual('email not defined');
             
        })
        .end(done);         
    });       
});

describe('delete /user/:id', function() {
    
    it('respond with the user that have been removed',function(done){
        
        rest.delete('/user/6') 
        .send()
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(res.body[0]).toEqual(user3); 
        })   
        .end(done);
    });
    
     it('respond "user not found " if the user has already been removed or not exist', function(done){
        
        rest.delete('/user/6') 
        .send()
        .expect(function(res) {
            expect(res.status).toBe(404);       
            expect(res.error.text).toEqual('user not found'); 
        })   
        .end(done);
    });
         
});

describe('delete /user/:id/contact/:contactId', function() {
    
    it('respond with "user not found" if :id is not defined' ,function(done){
        
        rest.delete('/user/\'\'/contact/3') 
        .send()
        .expect(function(res) {
            expect(res.status).toBe(404);       
            expect(res.error.text).toEqual('user not found');
        })   
        .end(done);
    });
    
    it('respond with "user not found" if :contactId is not defined' ,function(done){
        
         rest.delete('/user/2/contact/\'\'') 
        .send()
        .expect(function(res) {
            expect(res.status).toBe(404);       
            expect(res.error.text).toEqual('user not found');
        })   
        .end(done);
    });
    
    it('respond with "user not found" if both id is not defined' ,function(done){
        
         rest.delete('/user/\'\'/contact/\'\'') 
        .send()
        .expect(function(res) {
            expect(res.status).toBe(404);       
            expect(res.error.text).toEqual('user not found');
        })   
        .end(done);
    });
    
    it('respond with user object without the contact' ,function(done){
        
        var expectedUser = user1;
        expectedUser.contacts =[];
        
         rest.delete('/user/1/contact/2') 
        .send()
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(expectedUser);
        })   
        .end(done);
    });
       
    it('respond with the user without change' ,function(done){
         var expectedUser = user1;
         expectedUser.contacts =[];
        
         rest.delete('/user/1/contact/2') 
        .send()
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(res.body).toEqual(expectedUser);
        })   
        .end(done);
    });     
});