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



var mongoose = require('mongoose');
var service = {};
service.addnotification = addnotification;


function addnotification(notificationsdetails) {

  var deferred = Q.defer();
  
  var tokens = []
  for (let i = 0; i < notificationsdetails.users.length; i++) {

    tokens.push(notificationsdetails.users[i].deviceToken)
  }

  var payload = {
    data: {   
      title: "sub",
      body: "msg",
    },
    notification: {
      title: "sub",
      body: notificationsdetails.Message,
      sound: 'enabled',
    },
  };
  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };


   var userid = []
    for (let i = 0; i < notificationsdetails.users.length; i++) {

      userid.push({ 'userId': notificationsdetails.users[i]._id })
    }  
  
          var saveusers = new notifications({
              users : userid,
              message: notificationsdetails.Message,

          });
          saveusers.save(
               function (err, savequerys) {
              if (!err) {

                admin.messaging().sendToDevice(tokens, payload, options)
                  .then(function (response) {
                    // console.log("Successfully sent message:");
                    deferred.resolve(savequerys);
                  })
                  .catch(function (error) {
                    // console.log("Error sending message:", error);
                 });
              } else {
                  deferred.reject(err.name + ': ' + err.message);
              }
          })

  return deferred.promise;

}
module.exports = service;