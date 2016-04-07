
relationsRequest = [
    {
       userAskingId : String,
       userAskedId  : String,
       status       : String // values : [waiting,accepted,refued] 
    }
];



beaconDbStub = [
    { 
       idBeacon        : String,
       associatedPlace : String,
       longitude       : Number, //Float
       latitude        : Number  //Float
    }
];



searchFieldsDb = {
        industry : [String],               
        company  : [String],
        location : [String],
        place    : [String]       
}


suggestDb = [
        {
        userId          : String,
        rotationIndex   : Number,
        compatibleUsers : [
            {
                userId      : String, 
                pourcentage : Number //Integer
            }
        ]        
        }
    ]   


transfertDb [
    {
        dlink       : String,
        usersTokens : [String],
        sender      : String 
    }
  ]


userDbStub = [
    { 
       id           :  String,
       firstName    :  String,
       lastName     :  String,
       emailAddress :  String,
       password     :  String,
       headline     :  String,
       industry     :  String,
       pictureUrl   :  String,
       positions    : {
                _total : Number, //integer
                values : [
                    {
                        company   : {
                            id        : Number,
                            industry  : String,
                            name      : String,
                            size      : String,
                            type      : String
                        },
                        id        : Number, //integer
                        isCurrent : Boolean,
                        startDate : {month : Number, year : Number},
                        summary   : String ,
                        title     : String ,
                    }
                ]
       },
       location     : {country : { code : String}, name : String},
       specialties  : String,
       contacts     : [
           {
            id : String
           }
       ],
      place         : { uuid :String , associatedPlace: String},
      tokenDevice   : String
    }
]