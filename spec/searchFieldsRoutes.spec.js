var superTest= require('supertest');
var sha1 = require('sha1');
var rest = superTest.agent("http://localhost:8091");

var searchDb = require('../database/searchFieldsDb');

describe('get /searchFields/', function() {
   
   it('respond with searchFields Object empty or not', function(done){

        
        rest.get('/searchfields/')
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).not.toEqual({});
            expect(req.body.industry).toBeDefined();
            expect(req.body.place).toBeDefined();
            expect(req.body.company).toBeDefined();
            expect(req.body.location).toBeDefined();
        })
        .end(done);         
    });
});

describe('get /searchFields/supply', function() {
      
    it('respond with searchFields Object empty or not after feed the database with userInformation', function(done){

        
        rest.get('/searchfields/supply')
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(req.body).not.toEqual({});
            expect(req.body.industry).toBeDefined();
            expect(req.body.place).toBeDefined();
            expect(req.body.company).toBeDefined();
            expect(req.body.location).toBeDefined();
        })
        .end(done);         
    });
          
});       