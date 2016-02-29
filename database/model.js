var userModel = {

    id: String,
    firstName: String,
    lastName: String,
    emailAddress : String,
    password: String,
    headline : String,
    industry : String,
    pictureUrl : String,
    location : {},
    positions: [],
    specialties:String,
    contacts:[{
        id:String
    }],
    place : {
             uuid:String, 
             associatedPlace: String
    }

}

var beaconModel = {

    idBeacon: String,
    associatedPlace: String,
    longitude : Number, //float
    latitude  : Number, //float
    services  :[]

}