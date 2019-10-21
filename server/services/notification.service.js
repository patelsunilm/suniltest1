var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var FCM = require('fcm-node');
var notifications = require('../controllers/notifications/notifications.model');

var serverKey = require('../firebase/smaf-64257-firebase-adminsdk-hqkm1-145f2b27da.json') 

 var fcm = require('fcm-notification');
 var FCM = new fcm(serverKey);


var mongoose = require('mongoose');
var service = {};
service.addnotification = addnotification;


function addnotification(notificationsdetails) {
var deferred = Q.defer();

var tokens = []
for (let i = 0; i < notificationsdetails.users.length; i++) {
    
    tokens.push(notificationsdetails.users[i].deviceToken)
  }  

//   var messages = {
//     notification:{
//           title : 'Title name',
//           body : notifications.Message
//     }
// }
 

FCM.subscribeToTopic(tokens,  notificationsdetails.Message, function(err, response) {
    if(err){
       
           deferred.resolve(response);
    }else {
                var data = {};
                data.string = 'Notification success fully send.';
                deferred.resolve(data);
    }
})

return deferred.promise;


// return false
//  var userid = []
//   for (let i = 0; i < message.users.length; i++) {
    
//     userid.push({ 'userId': message.users[i]._id })
//   }  
 
      
//         var deferred = Q.defer();
//         var saveusers = new notifications({
            
//             users : userid,
//             message: message.Message,
           
//         });
       
//         saveusers.save(
//              function (err, savequerys) {
//             if (!err) {

                
//                 deferred.resolve(savequerys);
//             } else {


//                 deferred.reject(err.name + ': ' + err.message);
//             }
//         })

//         return deferred.promise;

}


module.exports = service;