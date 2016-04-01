var superTest= require('supertest');
var rest = superTest.agent("http://localhost:8091");
var fs = require('fs');

var transfertDb = require('../database/transfertDb');

var transfertDbStub = [{
   'dlink':"https://rpro-epic2.rhcloud.com/fileupload/fileStub.txt",
   'sender' : 'john',
   'usersTokens' : ['fKJ1CXRhMdI:APA91bH3DooQ3z72M5z-rEgSnx5zfHRQF5QZm9kyxQbW6x1nhdAQIXp0RularaDUyuyFkRMrxjJTgV0bAgLO4sIR2vYXKRRqz-IBoM7ZVz_Hwe3awlqpXkOnC6HjSbJFiNVpYgeunzgN']
}] 

describe('POST /upload/file', function() {
    
   it('Should return ok, write the document and create entry in transfertDb', function(done) {      

           rest.post('/fileupload/upload/file')
            .field('users', '[{"tokenDevice" : "fKJ1CXRhMdI:APA91bH3DooQ3z72M5z-rEgSnx5zfHRQF5QZm9kyxQbW6x1nhdAQIXp0RularaDUyuyFkRMrxjJTgV0bAgLO4sIR2vYXKRRqz-IBoM7ZVz_Hwe3awlqpXkOnC6HjSbJFiNVpYgeunzgN"}]')
            .field('sender', 'john')           
            .attach('file', __dirname+'/fileStub.txt', 'fileStub.txt')            
            .expect(function(res) {
                expect(res.status).toBe(200);
                expect(transfertDb).toEqual(transfertDbStub);                                                   
            })
            .end(done); 
                
    });
    
    it('Should return "403 file not uploaded", if no file is sended', function(done) {      

           rest.post('/fileupload/upload/file')       
            .send()        
            .expect(function(res) {
                expect(res.status).toBe(400);
                expect(res.error.text).toEqual('file not uploaded');                                                   
            })
            .end(done); 
                
    });
    

});

describe('GET /transfers', function() {
    
    
    it('Should return uploading file in waiting', function(done) {      

           rest.get('/fileupload/transfers')       
            .send()        
            .expect(function(res) {
                expect(res.body.length).toBeGreaterThan(0)               
                expect(res.status).toBe(200);                                                 
            })
            .end(done); 
                
    });
    

});

describe('POST /allowtransfer', function() {
    
    
    it('Should return 200 with notification push to all devices involved in', function(done) {      

           rest.post('/fileupload/allowtransfer')       
            .send()        
            .expect(function(res) {
                                   
                expect(res.status).toBe(200);                                                 
            })
            .end(done); 
                
    });
    
     it('Should return 403 "no waiting download" if there is no waiting file', function(done) {      

           rest.post('/fileupload/allowtransfer')       
            .send()        
            .expect(function(res) {
                expect(res.error.text).toBe('no waiting download');             
                expect(res.status).toBe(400);                                                 
            })
            .end(done); 
                
    });

});