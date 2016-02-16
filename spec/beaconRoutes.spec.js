var superTest= require('supertest');
var sha1 = require('sha1');
var rest = superTest.agent("http://localhost:8091");

/**
 * Note : to see stub data go to the file under test : beaconRoutes.js
 * some it() function are design to be in order , take care if you edit it 
 */


var beacon1 =  { 
       idBeacon:'a123',
       associatedPlace:'gare mont-parnasse',
       longitude : 2.31,
       latitude  : 48.8
    };
    
var beacon2 = {
       idBeacon:'b345',
       associatedPlace : 'train Nantes-Paris',
       longitude: 0.0,
       latitude : 0.0 
    };



describe('GET /beacon/', function() {
   
   it('respond with all beacon in the database', function(done){
       
        rest.get('/beacon/')
        .expect(function(res) {
            expect(res.status).toBe(200);       
            expect(res.body.length).toEqual(2);                    
        })
        .end(done);         
    });
});

describe('GET /beacon/:id', function(){
    
   it('respond with beacon object that match with the id', function(done) {
       
        rest.get('/beacon/a123')
        .expect(function(res) {
            expect(res.status).toBe(200);
            expect(res.body.idBeacon).toBe(beacon1.idBeacon);
            expect(res.body.associatedPlace).toBe(beacon1.associatedPlace);
            expect(res.body.longitude).toBe(beacon1.longitude);
            expect(res.body.latitude).toBe(beacon1.latitude);     
        })
        .end(done);  
   });
   
   
   it('respond with "beacon not found" if the id is not in the database', function(done) {
       
        rest.get('/beacon/13')
        .expect(function(res) {
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('beacon not found');

        })
        .end(done);  
   });
   
   
   
});

describe('GET /beacon/:id/place', function(){
    
   it('respond with place from the beacon object that match with the id', function(done) {
       
        rest.get('/beacon/a123/place')
        .expect(function(res) {
            expect(res.status).toBe(200);
            expect(res.body).toEqual({place:'gare mont-parnasse'});  
        })
        .end(done);  
   });
   
   
   it('respond with "beacon not found" if the id is not in the database', function(done) {
       
        rest.get('/beacon/13/place')
        .expect(function(res) {
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('beacon not found');

        })
        .end(done);  
   });
});

describe('POST /beacon/:id', function(){
    
   it('respond with beacon updated from the beacon object that match with the id', function(done) {
        var expectedBeacon = { idBeacon: 'b345', associatedPlace: 'train Nantes-Paris', longitude: 0, latitude: 0.36254 }
        
        rest.post('/beacon/b345')
        .send({latitude:0.36254})
        .expect(function(res) {
            expect(res.status).toBe(200);
            expect(res.body).toEqual(expectedBeacon);  
        })
        .end(done);  
   });
   
    it('respond with beacon with no update if no data has been sent', function(done) {
        var expectedBeacon = { idBeacon: 'b345', associatedPlace: 'train Nantes-Paris', longitude: 0, latitude: 0.36254 }
        
        rest.post('/beacon/b345')
        .send()
        .expect(function(res) {
            expect(res.status).toBe(200);
            expect(res.body).toEqual(expectedBeacon);  
        })
        .end(done);  
   });
   
   
   it('respond with "beacon not found" if the id is not in the database', function(done) {
       
        rest.post('/beacon/13/')
        .expect(function(res) {
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('beacon not found');

        })
        .end(done);  
   });
   
    it('respond with "beacon not found" if the id is not in the database', function(done) {
       
        rest.post('/beacon/\'\'/')
        .expect(function(res) {
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('beacon not found');

        })
        .end(done);  
   });
});


describe('PUT /beacon/', function(){
    
   it('respond with beacon object that has been inserted', function(done) {
        var expectedBeacon = { idBeacon: 'c541', associatedPlace: 'train Nantes-Paris', longitude: 0, latitude: 0.36254 }
        
        rest.put('/beacon/')
        .send(expectedBeacon)
        .expect(function(res) {
            expect(res.status).toBe(200);
            expect(res.body).toEqual(expectedBeacon);  
        })
        .end(done);  
   });
   
   
   it('respond with "id isn\'t an integer or is undefined in the request" if id is not send', function(done) {
       
        rest.put('/beacon/')
        .send()
        .expect(function(res) {
            expect(res.status).toBe(503);
            expect(res.error.text).toBe('id is undefined in the request');

        })
        .end(done);  
   });
   
});

describe('DELETE /beacon/:id', function(){
    
    it('respond with the beacon that has been removed ', function(done) {
       
        rest.delete('/beacon/a123')
        .expect(function(res) {
            expect(res.status).toBe(200);
            expect(res.body[0]).toEqual(beacon1);

        })
        .end(done);  
   });
   
    it('respond "beacon not found" if the beacon has been already removed or not exist', function(done) {
       
        rest.delete('/beacon/a123')
        .expect(function(res) {
            
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('beacon not found');

        })
        .end(done);  
   });
   
    it('respond "beacon not found" if the beacon has been already removed or not exist', function(done) {
       
        rest.delete('/beacon/\'\'')
        .expect(function(res) {
            
            expect(res.status).toBe(404);
            expect(res.error.text).toBe('beacon not found');

        })
        .end(done);  
   });
    
});