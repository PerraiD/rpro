var superTest= require('supertest');
var rest = superTest.agent("http://localhost:8091");
var fs = require('fs');

var transfertDb = require('../database/transfertDb');

var transfertDbStub = [{
   'dlink':"https://rpro-epic2.rhcloud.com/fileupload/fileStub.txt",
   'sender' : 'john',
   'usersTokens' : []
}] 

describe('POST /upload/file', function() {
    
   it('Should return ok, write the document and create entry in transfertDb', function(done) {      

           rest.post('/fileupload/upload/file')
            .field('users', '[]')
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

describe('GET /allowtransfer', function() {
    
    
    it('Should return 200 with notification push to all devices involved in', function(done) {      

           rest.get('/fileupload/allowtransfer')       
            .send()        
            .expect(function(res) {
                console.log(res.body);             
                expect(res.status).toBe(200);                                                 
            })
            .end(done); 
                
    });
    
     it('Should return 403 "no waiting download" if there is no waiting file', function(done) {      

           rest.get('/fileupload/allowtransfer')       
            .send()        
            .expect(function(res) {
                expect(res.error.text).toBe('no waiting download');             
                expect(res.status).toBe(400);                                                 
            })
            .end(done); 
                
    });

});