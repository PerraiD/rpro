/**
 * database that describe waiting invitation between users  
 *  schema : 
 * 
 * {
       userAskingId :'',
       userAskedId :'',
       place : ''  // beacon uuid => we use all associatedPlaces from beacon db
       message : '', // additionnal information for the invitation
       status: '' // values : [waiting,accepted] a refused == deletion of the invitationRequest 
    }
 * 
 */
var invitations = [];

module.exports = invitations;