var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var appuser = require('../controllers/Users/appusers.model');


var service = {};
service.GetallUsersDetails = GetallUsersDetails;
service.deleteappuser = deleteappuser;
service.getuserbyId = getuserbyId;
service.updateuserdetails = updateuserdetails;

function GetallUsersDetails() {

    var deferred = Q.defer();

    appuser.find(function (err, data) {

        if (!err) {
            deferred.resolve(data);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}


function deleteappuser(userid) {

    var deferred = Q.defer();
    appuser.deleteOne({ _id: new mongoose.Types.ObjectId(userid) },
        function (err) {
            if (err) {
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
            else {

                var data = {};
                data.string = 'Product deleted successfully.';
                deferred.resolve(data);
            }

        });
    return deferred.promise;
}


function getuserbyId(userid) {
    var deferred = Q.defer();
  
    appuser.findOne({ _id: userid }, function (err, getuser) {
        if (!err) {

            deferred.resolve(getuser);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });
    
    return deferred.promise;

}


function updateuserdetails(userdata) {

    var deferred = Q.defer();

    var id = new mongoose.Types.ObjectId(userdata.id);
    appuser.findOneAndUpdate({ _id: id }, {
        image: userdata.image,
        email: userdata.email,
        firstname: userdata.firstname,
        lastname: userdata.lastname,
        phone: userdata.phone,
       
    }, function (err, updateuserprofile) {

        if (!err) {
            deferred.resolve(updateuserprofile);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}
module.exports = service;
