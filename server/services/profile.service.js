var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');

var Users = require('../controllers/Users/users.model');// get our mongoose model
var countries = require('../controllers/profile/countries.model');
var states = require('../controllers/profile/states.model');
var city = require('../controllers/profile/cities.model');
var appuser = require('../controllers/Users/appusers.model');

var service = {};
service.getprofileInfo = getprofileInfo;
service.updateprofile = updateprofile;
service.getcountries = getcountries;
service.getstates = getstates;
service.getcity = getcity;
service.getuserprofile = getuserprofile;


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
                        getdata.image = getprofiledata.image;
                        getdata.name = getprofiledata.name;
                        getdata.email = getprofiledata.email;
                        getdata.address = getprofiledata.address;
                        getdata.datemodified = Date.now();

                        getdata.save(function (err, user) {
                          
                            if (!err) {
                                deferred.resolve({
                                    name: user.name,
                                    image: user.image,
                                });
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
                                getdata.countryid = getprofiledata.countries
                                getdata.stateid = getprofiledata.states
                                getdata.cityid = getprofiledata.city
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

    countries.find(function (err, countriesresults) {
        if (!err) {
            if (countriesresults) {

                var allcountries = [];
                countriesresults.forEach(element => {

                    var productcat = {}
                    productcat.countrieName = element.name;
                    productcat.countrieId = element.id
                    allcountries.push(productcat);

                });

                var contriesdetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        allcountries
                }


            } else {

                var contriesdetails = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }

            }

            deferred.resolve(contriesdetails);


        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}


function getstates(id) {
    var deferred = Q.defer();
    var countryid = parseInt(id);

    states.find({ country_id: countryid }, function (err, stateresults) {

        if (!err) {

            if (stateresults == '') {
                var statesdetails = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }

            } else {
                var allstate = [];
                stateresults.forEach(element => {

                    var states = {}
                    states.stateId = element.id;
                    states.stateName = element.name
                    allstate.push(states);

                });

                var statesdetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        allstate
                }

            }
            deferred.resolve(statesdetails);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}


function getcity(id) {

    var deferred = Q.defer();
    var stateid = parseInt(id);



    city.find({ state_id: stateid }, function (err, cityresults) {

        if (!err) {

            if (cityresults == '') {
                var citydetails = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
            } else {
                var allcity = [];
                cityresults.forEach(element => {
                    var citys = {}
                    citys.cityId = element.id;
                    citys.cityName = element.name
                    allcity.push(citys);

                });

                var citydetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        allcity
                }

            }

            deferred.resolve(citydetails);

        } else {


            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}


function getuserprofile(profile) {


    var deferred = Q.defer();
    var appusersnodatafound =
    {
        "status": "0",
        "message": "No data found.",
        "data": {

        }
    }
    appuser.findOne({ _id: profile.userid }, function (err, userdetail) {

        if (!err) {

            if (userdetail) {
                var appuserdetails =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        "email": userdetail.email,
                        "phone": userdetail.phone,
                        "firstname": userdetail.firstname,
                        "lastname": userdetail.lastname,
                        "image": userdetail.image
                    }
                }
                deferred.resolve(appuserdetails);
            } else {

                deferred.resolve(appusersnodatafound);
            }

        } else {

            deferred.resolve(appusersnodatafound);
        }
    });
    return deferred.promise;

}
module.exports = service;
