var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var notifications = require('../controllers/notifications/notifications.model');

var mongoose = require('mongoose');


var service = {};
service.addnotification = addnotification;


function addnotification(message) {

 var userid = []
  for (let i = 0; i < message.users.length; i++) {
    
    userid.push({ 'userId': message.users[i]._id })
  }  
 
        // var test = userid.toString(',');
        var deferred = Q.defer();
        var saveusers = new notifications({
            
            users : userid,
            message: message.Message,
           
        });
       
        saveusers.save(
             function (err, savequerys) {
            if (!err) {

                
                deferred.resolve(savequerys);
            } else {


                deferred.reject(err.name + ': ' + err.message);
            }
        })

        return deferred.promise;

}


module.exports = service;