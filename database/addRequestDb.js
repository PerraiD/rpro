/**
 * database that describe waiting relationship between users  
 *  
 */
var relations = [{
       userAskingId :'',
       userAskedId :'',
       status: '' // values : [waiting,accepted,refued] 
}, 
{
    "userAskingId":"lGyoWsXhU0",
    "userAskedId":"1ST3xUcP1E",
    "status":"waiting"
},
{
    "userAskingId":"lGyoWsXhU0",
    "userAskedId":"b2KvTMBUGK",
    "status":"waiting"
},
{
    "userAskingId":"lGyoWsXhU0",
    "userAskedId":"1",         
    "status":"waiting"
}];

module.exports = relations;