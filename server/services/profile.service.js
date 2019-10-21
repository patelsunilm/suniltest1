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
service.getAllcountries = getAllcountries;
service.getallstates = getallstates;
service.getallcity =getallcity;


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

    Users.aggregate([
        { "$match": { "userType": "Merchant" } },
        {
            $lookup: {
                from: "countries",
                localField: "countryid",
                foreignField: "id",
                as: "countries"
            }

        },
    ]).exec(function (err, results) {
        if (!err) {
            if (results == '' || results == null || results == 'null') {

                var countriesdetails = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(countriesdetails);

            } else {
                var allcountries = [];
                results.forEach(items => {
                    items.countries.forEach(element => {

                        var contris = {}
                        contris.countrieName = element.name == undefined ? '' : element.name;
                         var id = element.id.toString();
                        contris.countrieId = id == undefined ? '' : id;
                        allcountries.push(contris);

                    });
                });
              
                result = allcountries.filter(function (a) {
                    return !this[a.countrieName] && (this[a.countrieName] = true);
                }, Object.create(null));
         
                var contriesdetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        result
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
    Users.aggregate([
        { "$match": { "countryid":countryid } },
        {
            $lookup: {
                from: "states",
                localField: "stateid",
                foreignField: "id",
                as: "states"
            }

        },
    ]).exec(function (err, results) {
        if (!err) {
            if (results == '' || results == null || results == 'null') {

                var countriesdetails = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(countriesdetails);

            } else {
           
    
                var allstate = [];
                results.forEach(items => {
                    items.states.forEach(element => {
                        
                        var state = {}
                        state.stateName = element.name == undefined ? '' : element.name;
                        var id = element.id.toString();
                        state.stateId = id == undefined ? '' : id;
                        allstate.push(state);

                    });
                });
              
             
                result =  allstate.filter(function (a) {
                    return !this[a.stateName] && (this[a.stateName] = true);
                }, Object.create(null));
         
                var statedetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        result
                }
            }
            deferred.resolve(statedetails);
        } else {


            var countriesdetails = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }
            deferred.resolve(countriesdetails);

        }
    })
   
    return deferred.promise;
}


function getcity(id) {

    var deferred = Q.defer();
    var stateid = parseInt(id);

    Users.aggregate([
        { "$match": { "stateid":stateid } },
        {
            $lookup: {
                from: "cities",
                localField: "cityid",
                foreignField: "id",
                as: "cities"
            }

        },
    ]).exec(function (err, results) {
        if (!err) {
            if (results == '' || results == null || results == 'null') {

                var citiesdetails = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(citiesdetails);

            } else {
                var allcity = [];
                results.forEach(items => {
                    items.cities.forEach(element => {

                    var citys = {}
                    citys.cityId = element.id == undefined ? '' : element.id;
                    citys.cityName = element.name == undefined ? '' : element.name;
                    allcity.push(citys);

                    });
                });
              
                result = allcity.filter(function (a) {
                    return !this[a.cityName] && (this[a.cityName] = true);
                }, Object.create(null));
                 
               
                var contriesdetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        result
                }
                deferred.resolve(contriesdetails);
            }
            
        } else {

            var citiesdetails = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }
            deferred.resolve(citiesdetails);
        }
    })

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
    appuser.findOne({ _id: profile.userId }, function (err, userdetail) {

        if (!err) {

            if (userdetail) {
                var appuserdetails =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        "email": userdetail.email,
                        "phone": userdetail.phone,
                        "firstName": userdetail.firstname,
                        "lastName": userdetail.lastname,
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


function getAllcountries() {
    var deferred = Q.defer();

    countries.find(function (err, countriesresults) {
        if (!err) {
            if (countriesresults) {

                var allcountries = [];
                countriesresults.forEach(element => {

                    var productcat = {}
                    productcat.countrieName = element.name == undefined ? '' : element.name;
                    productcat.countrieId = element.id == undefined ? '' : element.id
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



function getallstates(id) {
    
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
                    states.stateId = element.id == undefined ? '' : element.id;
                    states.stateName = element.name == undefined ? '' : element.name;
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

function  getallcity (id) {

   
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
                    citys.cityId = element.id == undefined ? '' : element.id;
                    citys.cityName = element.name == undefined ? '' : element.name;
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
module.exports = service;
