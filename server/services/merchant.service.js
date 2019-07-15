var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var users = require('../controllers/Users/users.model');
var mongoose = require('mongoose');

var service = {};
service.getallMerchentsData = getallMerchentsData;
service.merchantStatusToggle = merchantStatusToggle;
service.updatemerchantData = updatemerchantData;
service.getmerchantDatabyId = getmerchantDatabyId;
service.deletemerchantData = deletemerchantData;

function getallMerchentsData() {
    var deferred = Q.defer();

    users.find({ userType: 'Merchant' }, function (err, getData) {
        if (!err) {
            deferred.resolve(getData);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}


function getmerchantDatabyId(merchantDataId) {
    var deferred = Q.defer();
    var merchantDataId = new mongoose.Types.ObjectId(merchantDataId);

    users.findOne(merchantDataId, function (err, getdata) {
        if (!err) {
            deferred.resolve(getdata);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}


function updatemerchantData(merchantdata) {

    var deferred = Q.defer();
    var email = new RegExp("^" + merchantdata.email + "$", "i")
    users.find({ $and: [{ email: email }, { _id: { $ne: merchantdata._id } }] }, function (err, datalength) {
        if (datalength.length > 0) {
            var data = {};
            data.string = 'Email is already exist.';
            deferred.resolve(data);

        } else if (merchantdata.businessname) {
            var businessname = new RegExp("^" + merchantdata.businessname + "$", "i")
            users.find({ $and: [{ businessname: businessname }, { _id: { $ne: merchantdata._id } }] }, function (err, datalength) {
                if (datalength.length > 0) {
                    var data = {};
                    data.string = 'Business Name is already exist.';
                    deferred.resolve(data);
                } else {
                    users.findById(merchantdata._id, function (err, getdata) {
                        if (!err) {

                            getdata.name = merchantdata.name;
                            getdata.address = merchantdata.address;
                            getdata.email = merchantdata.email;
                            getdata.businessname = merchantdata.businessname;
                            getdata.status = merchantdata.status;
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

                    })
                }
            })
        }



    })

    return deferred.promise;
}


function merchantStatusToggle(merchantdata) {
    var deferred = Q.defer();
    users.findById(merchantdata.id, function (err, getdata) {
        if (!err) {
            getdata.status = merchantdata.status;
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
    return deferred.promise;
}



function deletemerchantData(merchantDataId) {

    var deferred = Q.defer();

    users.deleteOne({ _id: new mongoose.Types.ObjectId(merchantDataId) }, function (err) {
        if (err) {
            console.log(err);
            deferred.reject(err.name + ': ' + err.message);
        }
        else {
            deferred.resolve();
        }

    });

    return deferred.promise;

}

module.exports = service;
