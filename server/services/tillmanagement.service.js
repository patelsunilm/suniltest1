var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var tilltype = require('../controllers/tillmanagement/tilltype.model');
var tilldetails = require('../controllers/tillmanagement/tilldetails.model')


var service = {};

service.getalltillType = getalltillType;
service.addtilldetails = addtilldetails;
service.getAllsecondarytilltype = getAllsecondarytilltype;

function getalltillType() {
    var deferred = Q.defer();
    tilltype.find(function (err, type) {
        if (!err) {
            deferred.resolve(type);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}

function addtilldetails(details) {
    var deferred = Q.defer();

    tilldetails.findOne({ merchantId: details.merchantId }, function (err, results) {
        if (!err) {

            if (results == null || results == 'null' || results == '') {

                if (details.tilltype == "Primary") {

                    var till = new tilldetails({
                        name: details.tillName,
                        merchantId: details.merchantId,
                        primaryId: details.tillTypeId

                    });
                    till.save(function (err, savedetails) {
                        if (!err) {

                            var data = {};
                            data.string = 'Primary type is add successfully.';
                            deferred.resolve(data);
                        } else {

                            deferred.reject(err.name + ': ' + err.message);
                        }
                    });
                } else {

                    var data = {};
                    data.string = 'Pls Primary type select.';
                    deferred.resolve(data);
                }

            } else {
                if (details.tilltype == 'Primary') {

                    var data = {};
                    data.string = 'Primary type is already exist.';
                    deferred.resolve(data);
                } else {

                    if (details.tilltype == "Tertiary") {
                         
                        merchantId = new mongoose.Types.ObjectId(details.merchantId);
                        secondaryid = new mongoose.Types.ObjectId(details.Secondaryid);
                        var Name = new RegExp("^" + details.tillName + "$", "i")
                         
                           
                  
                        tilldetails.findOne({ "merchantId": merchantId },
                        { secondary: { $elemMatch: { _id:  secondaryid }}},
                        { tertiary:  { $elemMatch: { name: Name } } }
                       
                        ,function(req, responce){
                            
                            if(responce.secondary[0].tertiary.length  > 0 ) {
                                console.log('true');
                            } else {
                                console.log('false');
                            }
                        })

                        return false
                        merchantId = new mongoose.Types.ObjectId(details.merchantId);
                        secondaryid = new mongoose.Types.ObjectId(details.Secondaryid);
                        tilldetails.update(
                            { "merchantId": merchantId, "secondary._id": secondaryid },
                            {
                                "$push":
                                {
                                    "secondary.$.tertiary":
                                    {
                                        "name": details.tillName,

                                    }
                                }

                            }, function (err, responce) {
                                if (err) {
                                    deferred.reject(err.name + ': ' + err.message);

                                } else {

                                    var data = {};
                                    data.string = 'tertiary name is add successfully.';
                                    deferred.resolve(data);

                                }
                            })

                    } else {

                        var Name = new RegExp("^" + details.tillName + "$", "i")
                        tilldetails.findOne({ merchantId: details.merchantId },
                            { secondary: { $elemMatch: { name: Name } } }, function (err, test) {

                                if (test.secondary.length > 0) {
                                    var data = {};
                                    data.string = 'Name is already exist.';
                                    deferred.resolve(data);

                                } else {

                                    var tilldata = [];
                                    var i;
                                    tilldata.push({ 'name': details.tillName })
                                    tilldetails.findOneAndUpdate({
                                        merchantId: details.merchantId,
                                    },
                                        {
                                            $push: {
                                                secondary: tilldata
                                            },
                                        }, function (err, responce) {
                                            if (err) {

                                                deferred.reject(err.name + ': ' + err.message);

                                            } else {

                                                var data = {};
                                                data.string = 'Secondary type is add successfully.';
                                                deferred.resolve(data);

                                            }
                                        })
                                }
                            })

                    }
                }
            }

        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })

    return deferred.promise;
}



function getAllsecondarytilltype(merchantId) {


    var deferred = Q.defer();
    tilldetails.findOne({ merchantId: merchantId }, function (err, type) {
        if (!err) {

            deferred.resolve(type);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;


}

module.exports = service;
