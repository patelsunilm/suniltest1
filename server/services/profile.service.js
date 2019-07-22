var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var Users = require('../controllers/Users/users.model');// get our mongoose model

var service = {};
service.getprofileInfo = getprofileInfo;
service.updateprofile = updateprofile;


function getprofileInfo(userId) {
    var deferred = Q.defer();
    var userId = new mongoose.Types.ObjectId(userId);

    Users.findOne(userId, function (err, data) {
        if (!err) {
            deferred.resolve(data);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}


function updateprofile(getprofiledata) {


    var deferred = Q.defer();

    if (getprofiledata.userType == 'admin') {

        var email = new RegExp("^" + getprofiledata.email + "$", "i")
        Users.find({ $and: [{ email: email }, { _id: { $ne: getprofiledata._id } }] }, function (err, duplicateData) {

            if (duplicateData.length > 0) {
                var data = {};
                data.string = 'Email is already exist.';
                deferred.resolve(data);

            } else {
                // var imageData = [];
                // for (let i = 0; i < getprofiledata.image.length; i++) {

                //     imageData.push({ 'url': getprofiledata.image[i] })
                // }
                Users.findById(getprofiledata._id, function (err, getdata) {

                    if (!err) {
                        //  getdata.image = imageData
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

    } else {

        var email = new RegExp("^" + getprofiledata.email + "$", "i")
        Users.find({ $and: [{ email: email }, { _id: { $ne: getprofiledata._id } }] }, function (err, duplicateData) {

            if (duplicateData.length > 0) {
                var data = {};
                data.string = 'Email is already exist.';
                deferred.resolve(data);

            } else if (getprofiledata.businessname) {
                var businessname = new RegExp("^" + getprofiledata.businessname + "$", "i")
                Users.find({ $and: [{ businessname: businessname }, { _id: { $ne: getprofiledata._id } }] }, function (err, duplicateData) {
                    if (duplicateData.length > 0) {
                        var data = {};
                        data.string = 'BusinessName is already exist.';
                        deferred.resolve(data);

                    } else {
                        Users.findById(getprofiledata._id, function (err, getdata) {

                            if (!err) {
                                getdata.name = getprofiledata.name;
                                getdata.email = getprofiledata.email;
                                getdata.address = getprofiledata.address;
                                getdata.businessname = getprofiledata.businessname;
                                getdata.secretquestion = getprofiledata.Secretquestion;
                                getdata.secretanswer = getprofiledata.Secretanswer;
                                getdata.backgroundtheme = getprofiledata.backgroundtheme;
                                getdata.fontcolor = getprofiledata.fontcolor;
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

            }
        })

    }



    return deferred.promise;
}


module.exports = service;
