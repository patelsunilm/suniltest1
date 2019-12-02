var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var notifications = require('../controllers/notifications/notifications.model');
// var FCM = require('fcm-node');
// var serverKey = require('../firebase/smaf-16fe3-firebase-adminsdk-yd062-0419020f3f.json'); 
// var fcm = require('fcm-notification');
// var FCM = new fcm(serverKey);
var fcm = require('fcm-notification');
var admin = require("firebase-admin");
var path = require('../firebase/smaf-16fe3-firebase-adminsdk-yd062-0419020f3f.json')
var FCM = new fcm(path);

// var fcm = require('fcm-notification');
// var admin = require("firebase-admin");
// var path = require('../../public/pushkey.json')
// var FCM = new fcm(path);

var mongoose = require('mongoose');
var service = {};
service.addnotification = addnotification;


function addnotification(notificationsdetails) {

  var deferred = Q.defer();

  var tokens = []
  for (let i = 0; i < notificationsdetails.users.length; i++) {

    tokens.push(notificationsdetails.users[i].deviceToken)
  }

  
  var message = {
    data: {    //This is only optional, you can send any data
      //     score: '850',
      //     time: '2:45'
    },
    notification: {
      title: "smfa",
      body: notificationsdetails.Message
    },
    //   token: token
  };

  var userid = []
  for (let i = 0; i < notificationsdetails.users.length; i++) {
    userid.push({ 'userId': notificationsdetails.users[i]._id })
  }

  var saveusers = new notifications({
    users: userid,
    message: notificationsdetails.Message,

  });

  saveusers.save(
    function (err, savequerys) {
      if (!err) {

        FCM.sendToMultipleToken(message, tokens, function (err, response) {
          if (err) {
            
            deferred.reject(error);
          } else {
            
            deferred.resolve(savequerys);
          }
        })


      } else {
        deferred.reject(err.name + ': ' + err.message);
      }
    })

  return deferred.promise;

}
module.exports = service;