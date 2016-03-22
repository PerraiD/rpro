var superTest= require('supertest');
var rest = superTest.agent("http://localhost:8091");


var addRequestDb = require('../database/addRequestDb');

var addrequestStub = [{
    'userAsking' : '1',
    'userAsked' : '2',
    'status' : 'waiting'
}]

addRequestDb.pop(); // we clean the database before test 

describe('PUT /addrequest/adding', function() {
    
   it('Should return with the status of the  waiting add request that has been created in addrequestDb', function(done) {      
       
       var addrequest = {
            'userId1' : '1',
            'userId2' : '2',           
        }
         
        rest.put('/addrequest/adding')
        .send(addrequest)
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).toEqual({status:'waiting'});
            expect(addRequestDb).toEqual(addrequest);                    
        })
        .end(done);            
    });
    
     it('Should return "error userIds malformed" if the one of id isnt defined' , function(done) {      
       
      var addrequest = {
            'userId1' : '',
            'userId2' : '2',           
        }
         
        rest.put('/addrequest/adding')
        .send(addrequest)
        .expect(function(res) {
            expect(res.status).toBe(403);       
            expect(res.error.text).toEqual('error userIds malformed');                    
        })
        .end(done);         
    });
    
     it('Should return "error userIds malformed" if the one of id isnt defined' , function(done) {      
       
      var addrequest = {
            'userId1' : '1',
            'userId2' : '',           
        }
         
        rest.put('/addrequest/adding')
        .send(addrequest)
        .expect(function(res) {
            expect(res.status).toBe(403);       
            expect(res.error.text).toEqual('error userIds malformed');                    
        })
        .end(done);         
    });
    
     it('Should return "error userIds malformed" if any id is defined' , function(done) {      
       
      var addrequest = {
                      
        }
         
        rest.put('/addrequest/adding')
        .send(addrequest)
        .expect(function(res) {
            expect(res.status).toBe(403);       
            expect(res.error.text).toEqual('error userIds malformed');                    
        })
        .end(done);         
    });
    
});


describe('GET /addrequest/', function() {
    
     it('respond with the entire addrequestDb', function(done){        
        rest.get('/addrequest/')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).toEqual(addrequestStub);                    
        })
        .end(done);         
    });
}); 


describe('GET /addrequest/:userId', function() {
    
     it('respond with all addrequest from a user if user id is valid', function(done){
               
        rest.get('/addrequest/1')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).toEqual(addRequestDb);                    
        })
        .end(done);         
    });
    
    
}); 

describe('GET /status/:userId1/:userId2/', function() {
    
     it('respond with the status between userId1 and userId2 ', function(done){        
        rest.get('/addrequest/status/1/2')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).toEqual({status:'waiting'});                    
        })
        .end(done);         
    });
    
     it('respond with "not found  " userId1 or  userId2 isn\'t defined ', function(done){        
        rest.get('/addrequest/status//2')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(404);       
            expect(req.body).toEqual('not found');                    
        })
        .end(done);         
    });
    
     it('respond with "not found  "userId1 or  userId2 isn\'t defined ', function(done){        
        rest.get('/addrequest/status/1/')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(404);       
            expect(req.body).toEqual('not found');                    
        })
        .end(done);         
    });
    
     it('respond with "not found  "userId1 and userId2 arn\'t defined ', function(done){        
        rest.get('/addrequest/status/1/')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(404);       
            expect(req.error.text).toEqual('not found');                    
        })
        .end(done);         
    });
}); 

describe('GET /waiting/:userId', function() {
    
     it('respond with waiting request for user id  ', function(done){        
        rest.get('/addrequest/waiting/1')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).toEqual(addrequestStub);                    
        })
        .end(done);         
    });
   
   it('respond with empty waiting request for not defined userid', function(done){        
        rest.get('/addrequest/waiting/2')
        //.send(tmpuser)
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).toEqual([]);                    
        })
        .end(done);         
    }); 
   
});