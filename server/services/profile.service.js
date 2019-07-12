var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var Users = require('../controllers/Users/users.model');// get our mongoose model

var service = {};
service.getprofileInfo = getprofileInfo;
service.updateprofile = updateprofile;


function getprofileInfo(resellersId) {
    var deferred = Q.defer();
    var resellersId = new mongoose.Types.ObjectId(resellersId);

    Users.findOne(resellersId, function (err, resellers) {
        if (!err) {
            deferred.resolve(resellers);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}


function updateprofile(getprofiledata) {


    var deferred = Q.defer();
    var email = new RegExp("^" + getprofiledata.email + "$", "i")
    Users.find({ $and: [{ email: email }, { _id: { $ne: getprofiledata._id } }] }, function (err, duplicateData) {
       
        if (duplicateData.length > 0) {
            var data = {};
            data.string = 'Email is already exist.';
            deferred.resolve(data);

        } else {
            Users.findById(getprofiledata._id, function (err, getdata) {

                if (!err) {
                    getdata.name = getprofiledata.name;
                    getdata.email = getprofiledata.email;
                    getdata.address = getprofiledata.address;
                    getdata.datemodified = Date.now();

                    getdata.save(function (err) {
                        if (!err) {
                            deferred.resolve(getdata);
                        } else {
                            deferred.reject(err.name + ': ' + err.message);
                        }
                    });

                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }

            });

        }
    })

    return deferred.promise;
}


module.exports = service;
