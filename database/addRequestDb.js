/**
 * database that describe waiting relationship between users  
 *  
 */
var relations = [{
       userAskingId :'',
       userAskedId :'',
       status: '' // values : [waiting,accepted] a refused == deletion of the addRequest 
}];

module.exports = relations;