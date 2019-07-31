var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var Users = require('../controllers/Users/users.model');// get our mongoose model
var contries = require('../controllers/profile/countries.model');
var states = require('../controllers/profile/states.model')
var city = require('../controllers/profile/cities.model')

var service = {};
service.getprofileInfo = getprofileInfo;
service.updateprofile = updateprofile;
service.getcountries  = getcountries;
service.getstates = getstates;
service.getcity = getcity;


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
                Users.findById(getprofiledata._id, function (err, getdata) {

                    if (!err) {
                        getdata.image = getprofiledata.image
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

                                getdata.image = getprofiledata.image;
                                getdata.name = getprofiledata.name;
                                getdata.email = getprofiledata.email;
                                getdata.address = getprofiledata.address;
                                getdata.businessname = getprofiledata.businessname;
                                getdata.secretquestion = getprofiledata.Secretquestion;
                                getdata.secretanswer = getprofiledata.Secretanswer;
                                getdata.backgroundtheme = getprofiledata.backgroundtheme;
                                getdata.fontcolor = getprofiledata.fontcolor;
                               
                                getdata.merchantcatid = getprofiledata.merchantcatname
                                getdata.countriid = getprofiledata.countries
                                getdata.stateid = getprofiledata.states
                                getdata.cityid =  parseInt(getprofiledata.city)
                                
                               
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


function getcountries() {
   
    var deferred = Q.defer();

    contries.find(function (err, contries) {
        if (!err) {
           
            deferred.resolve(contries);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}


function getstates(id) {
    var deferred = Q.defer();
    var countryid = parseInt(id);
   
    states.find({country_id : countryid}, function (err, data) {
    
        if (!err) {
           
            deferred.resolve(data);
      
        } else {
           
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}


function getcity(id) {
   
    var deferred = Q.defer();
    var stateid = parseInt(id);
   
    city.find({state_id : stateid}, function (err, data) {
    
        if (!err) {
           
            deferred.resolve(data);
      
        } else {
           
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}
module.exports = service;
