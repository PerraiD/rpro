//stub of data;
// use table , should be replace by a real database for users
var userDbStub = [
    { 
       id:'1',
       firstName:'john',
       lastName: 'doe',
       emailAddress : 'john.doe@mail.com',
       password: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
       headline : 'designer of software in different big company',
       industry : 'Software Designer',
       pictureUrl : '',
       positions: {
            _total: 1,
            values:[{
                company: {
                    id: 2628661,
                    industry: "Information Technology and Services",
                    name: "CGI en France",
                    size: "10,001+ employees",
                    type: "Public Company",
                },
                id: 775983171,
                isCurrent: true,
                startDate: {month: 1, year: 2016},
                summary: "HTML , CSS, Codova, Typescript et d'un serveur REST en NodeJS.",
                title: "Stagiaire concepteur de solutions informatique : internet des objets et usages innovants",
            }]
        },
       location: {"country":{"code":"fr"},"name":"Nantes Area, France"},
       specialties:'',
       contacts:[{
           id:'2'
       }],
      "place":{"uuid":"","associatedPlace":"Inconnu"}   
    },
    {
       id:'2',
       firstName :'barb',
       lastName : 'dirt',
       emailAddress : 'barb.dirt@mail.com',
       password : '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
       headline:"Agent de la cia",
       industry:"Computer Software",
       positions:{  
            _total:1,
            values:[  
                {  
                    company:{  
                        id:2628661,
                        industry:"Information Technology and Services",
                        name:"Atos",
                        size:"10,001+ employees",
                        type:"Public Company"
                    },
                    id:617429425,
                    isCurrent:true,
                    startDate:{  
                    month:12,
                    year:2014
                    },
                    summary:"Agent secret dans différentes missions pour la cia",
                    title:"Agent de la cia"
                }
            ]
        },
       location: {"country":{"code":"fr"},"name":"Nantes Area, France"},
       specialties:'',
       contacts:[],
       "place":{"uuid":"","associatedPlace":"Inconnu"} 
    },
    {  
        id:"1ST3xUcP1E",
        firstName:"Nicolas",
        lastName:"Nathan",
        emailAddress:"nicolas.nathan@gmail.com",
        password:"0b9c2625dc21ef05f6ad4ddf47c5f203837aa32c",
        headline:"Expert technique senior .Net",
        industry:"Computer Software",
        pictureUrl:"https://media.licdn.com/mpr/mprx/0_SLdZcZJDeQXdRuIj7CUwcVJDe3TkUdRjfGjFcVRpBXvNkS2g3iJNMs7-Q73U4aVAu6IQ4gLxglWl",
        positions:{  
            _total:1,
            values:[  
                {  
                    company:{  
                        id:2628661,
                        industry:"Information Technology and Services",
                        name:"CGI en France",
                        size:"10,001+ employees",
                        type:"Public Company"
                    },
                    id:617429425,
                    isCurrent:true,
                    startDate:{  
                    month:12,
                    year:2014
                    },
                    summary:"EID filiale CIC / Crédit mutuel : Développement C#, Xaml, Html, JavaScript, Webservice WCF Développement Node.JS, Cloud Openshift, JavaScript, Asp.net Mvc, Entity framework, Bootstrap. POC IoT, technologie mobile.",
                    title:"Expert technique senior .Net"
                }
            ]
        },
        location:{  
            country:{  
                code:"fr"
            },
            name:"Nantes Area, France"
        },
        specialties:"",
        contacts:[  
            
        ],
        place:{  
            uuid:"",
            associatedPlace:"Inconnu"
        }
    },
    {
        "id":"b2KvTMBUGK",
        "firstName":"Charles",
        "lastName":"Gallard",
        "emailAddress":"morpheus0010@msn.com",
        "password":"ca52b6563d364dbc4a0ffdceee6a30abbbb55a03",
        "headline":"Ingénieur en Technologies de l'Information chez CGI en France",
        "industry":"Information Technology and Services",
        
        "pictureUrl":"https://media.licdn.com/mpr/mprx/0_Pz_4iq_h5jw7R2DbrizMe_x38dnaRp76Mkc45hX3TuV7Y2OQvAzZw-E3_doaYDxR0kUMw_dTdmUfZ4KwVQQXIhHSumUmZ4sbMQQRh3j8b7mGtaTRzcrv8v1l2RTYA4DnrLGqb0t7yne",
        "positions":{
                        "_total":1,
                        "values":[{
                            "company":{
                                "id":2628661,
                                "industry":"Information Technology and Services",
                                "name":"CGI en France",
                                "size":"10,001+ employees",
                                "type":"Public Company"
                            },
                            "id":733135816,
                            "isCurrent":true,
                            "startDate":{"month":11,"year":2015},
                            "title":"Ingénieur en Technologies de l'Information"
                    }]},
        "location":{"country":{"code":"fr"},"name":"Nantes Area, France"},
        "specialties":"",
        "contacts":[],
        "place":{"uuid":"","associatedPlace":"Inconnu"}
    },
    {
        "id": "lGyoWsXhU",
        "firstName": "david",
        "lastName": "perrai",
        "emailAddress": "davidperrai@gmail.com",
        "password": "ca52b6563d364dbc4a0ffdceee6a30abbbb55a03",
        "headline": "Stagiaire concepteur de solutions informatique : internet des objets et usages innovants chez CGI en France",
        "industry": "Computer Software",
        "pictureUrl": "https://media.licdn.com/mpr/mprx/0_PtRfS_ZpMVaYt6XzMt73QBTjZ2AGlX9Npi_fIBNpYgi_lqsvrnS3h-npRgeGqNczrk77L6zyr2CiBhU4p3O15BZKv2CCBhOMp3O2mnSgYDBag9LLKKeCaG_uzMZtOhWevCsidHw8L-W",
        "positions": {
            "_total": 1,
            "values": [{
                "company": {
                    "id": 2628661,
                    "industry": "Information Technology and Services",
                    "name": "CGI en France",
                    "size": "10,001+ employees",
                    "type": "Public Company"
                },
                "id": 775983171,
                "isCurrent": true,
                "startDate": {
                    "month": 1,
                    "year": 2016
                },
                "summary": "Conception et réalisation d'un P.O.C sur l'amélioration des échanges et mise en relations des personnes dans des lieux géolocalisés.\nMise en place de balises beacons pour une géolocalisation indoor et d'arduinos pour l'échange de médias.\nDéveloppement d'une application mobile réalisé avec Angular2, ionic 2, HTML , CSS, Codova, Typescript et d'un serveur REST en NodeJS.",
                "title": "Stagiaire concepteur de solutions informatique : internet des objets et usages innovants"
            }]
        },
        "location": {
            "country": {
                "code": "fr"
            },
            "name": "Nantes Area, France"
        },
        "specialties": "",
        "contacts": [],
        "place": {
            "uuid": "",
            "associatedPlace": "Inconnu"
        }
    }
]

module.exports =  userDbStub;