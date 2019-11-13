var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var tilltype = require('../controllers/tillmanagement/tilltype.model');
var tilldetails = require('../controllers/tillmanagement/tilldetails.model')
var products = require('../controllers/products/products.model');

var service = {};

service.getalltillType = getalltillType;
service.addtilldetails = addtilldetails;
service.getAllsecondarytilltype = getAllsecondarytilltype;
service.getTillManagementDetails = getTillManagementDetails;
service.deletetilltypename = deletetilltypename;
service.getTillnametbyId = getTillnametbyId;
service.updatetilltypename = updatetilltypename;


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
                            data.string = 'Primary type added successfully.';
                            deferred.resolve(data);
                        } else {

                            deferred.reject(err.name + ': ' + err.message);
                        }
                    });
                } else {

                    var data = {};
                    data.string = 'Please select primary type .';
                    deferred.resolve(data);
                }

            } else {
                if (details.tilltype == 'Primary') {

                    var data = {};
                    data.string = 'Primary type already exist.';
                    deferred.resolve(data);
                } else {

                    if (details.tilltype == "Tertiary") {

                        merchantId = new mongoose.Types.ObjectId(details.merchantId);
                        secondaryid = new mongoose.Types.ObjectId(details.Secondaryid);
                        var Name = new RegExp("^" + details.tillName + "$", "i")

                        tilldetails.aggregate([
                            { '$unwind': '$secondary' },
                            { '$unwind': '$secondary.tertiary' },
                            {
                                '$match': {
                                    'merchantId': merchantId,
                                    'secondary.tertiary.name': Name
                                }
                            },

                            { $sort: { dateadded: -1 } }]).exec(function (err, tilllist) {

                                if (tilllist.length > 0) {
                                    var data = {};
                                    data.string = 'Name already exist.';
                                    deferred.resolve(data);

                                } else {

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
                                                data.string = 'Tertiary name added successfully.';
                                                deferred.resolve(data);

                                            }
                                        })
                                }
                            })
                    } else {

                        var Name = new RegExp("^" + details.tillName + "$", "i")
                        tilldetails.findOne({ merchantId: details.merchantId },
                            { secondary: { $elemMatch: { name: Name } } }, function (err, test) {

                                if (test.secondary.length > 0) {
                                    var data = {};
                                    data.string = 'Name already exist.';
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
                                                data.string = 'Secondary type added successfully.';
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


function getTillManagementDetails(merchantId) {

    var deferred = Q.defer();
    tilldetails.find({ merchantId: merchantId }, function (err, tillResults) {
        if (!err) {

            deferred.resolve(tillResults);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}


function deletetilltypename(details) {

    if (details.tillsdetails.type == "Primary") {

        var id = details.tillsdetails._id;
        var deferred = Q.defer();
        tilldetails.deleteOne(
            { _id: new mongoose.Types.ObjectId(id) },
            function (err) {
                if (err) {

                    deferred.reject(err.name + ': ' + err.message);
                }
                else {

                    var data = {};
                    data.string = 'Primary type deleted successfully.';
                    deferred.resolve(data);
                }

            });
        return deferred.promise;
    } else if (details.tillsdetails.type == "Secondary") {

        var deferred = Q.defer();
        products.aggregate([
            {
                "$match": {
                    "merchantid": details.tillsdetails.merchantId, "tillTypeId": new mongoose.Types.ObjectId(details.tillsdetails._id)
                }
            }
        ]).exec(function (err, results) {
            if (results.length > 0) {
                var data = {};
                data.string = 'You cannot delete Secondary name as it assigned to product.';
                deferred.resolve(data);

            } else {

                tilldetails.aggregate([
                    {
                        "$match": {
                            "merchantId": new mongoose.Types.ObjectId(details.tillsdetails.merchantId)
                        }
                    },
                    { "$unwind": "$secondary" },
                    {
                        "$match": {
                            "secondary._id": new mongoose.Types.ObjectId(details.tillsdetails._id)
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "secondary.tertiary._id",
                            foreignField: "tillTypeId",
                            as: "test"
                        }

                    }
                ]).exec(function (err, results) {
                    if (results == '') {
                        var merchantId = details.tillsdetails.merchantId;
                        var secondaryid = details.tillsdetails._id;
                        tilldetails.update(

                            { merchantId: new mongoose.Types.ObjectId(merchantId) },
                            { $pull: { secondary: { _id: new mongoose.Types.ObjectId(secondaryid) } } },

                            function (err) {
                                if (err) {

                                    deferred.reject(err.name + ': ' + err.message);
                                }
                                else {
                                    var data = {};
                                    data.string = 'Secondary type deleted successfully.';
                                    deferred.resolve(data);
                                }
                            });
                    } else {

                        if (results[0].test.length > 0) {
                            var data = {};
                            data.string = 'You cannot delete Secondary name as it assigned to product.';
                            deferred.resolve(data);

                        } else {

                            var merchantId = details.tillsdetails.merchantId;
                            var secondaryid = details.tillsdetails._id;
                            tilldetails.update(

                                { merchantId: new mongoose.Types.ObjectId(merchantId) },
                                { $pull: { secondary: { _id: new mongoose.Types.ObjectId(secondaryid) } } },

                                function (err) {
                                    if (err) {

                                        deferred.reject(err.name + ': ' + err.message);
                                    }
                                    else {
                                        var data = {};
                                        data.string = 'Secondary type deleted successfully.';
                                        deferred.resolve(data);
                                    }
                                });
                        }

                    }
                })

            }
        })
        return deferred.promise;

    } else if (details.tillsdetails.type == "Tertiary") {


        var deferred = Q.defer();
        products.aggregate([
            {
                "$match": {
                    "merchantid": details.tillsdetails.merchantId, "tillTypeId": new mongoose.Types.ObjectId(details.tillsdetails.id)
                }
            }
        ]).exec(function (err, results) {

            if (results.length > 0) {
                var data = {};
                data.string = 'You cannot delete Tertiary name as it assigned to product.';
                deferred.resolve(data);

            } else {

                var merchantId = details.tillsdetails.merchantId;
                var secondaryid = details.tillsdetails.parentnameid;
                var tertiaryid = details.tillsdetails.id;

                tilldetails.update(
                    {
                        merchantId: new mongoose.Types.ObjectId(merchantId),
                        'secondary': { $elemMatch: { '_id': new mongoose.Types.ObjectId(secondaryid) } }
                    },
                    {
                        '$pull': {
                            'secondary.$.tertiary': {
                                '_id': new mongoose.Types.ObjectId(tertiaryid)
                            }
                        }
                    },
                    { multi: true },

                    function (err) {
                        if (err) {

                            deferred.reject(err.name + ': ' + err.message);
                        }
                        else {

                            var data = {};
                            data.string = 'Tertiary type deleted successfully.';
                            deferred.resolve(data);
                        }
                    });
            }
        })
        return deferred.promise;
    }
}


function getTillnametbyId(till) {


    if (till.tilltypeid.flag == 1) {
        var deferred = Q.defer();
        tilldetails.findOne({ $and:[{ _id: till.tilltypeid.id },{merchantid :  till.merchantId} ]}, function (err, tillResults) {
            if (!err) {
                
                if(tillResults == null || tillResults == "null" ) {
                    var getpro = {}    
                    getpro.error = "error"
                    getpro.flag = 1;
                   
                   deferred.resolve(getpro); 
              } else {
                var tills = {}
                tills.results = tillResults
                tills.flag = 1;
                deferred.resolve(tills);
              }

               
            } else {

                deferred.reject(err.name + ': ' + err.message);
            }
        });
        return deferred.promise;


    } else if (till.tilltypeid.flag == 2) {

        var deferred = Q.defer();
        tilldetails.findOne({ merchantId: till.merchantId }, { secondary: { $elemMatch: { _id: till.tilltypeid.id } } }, function (err, tillResults) {
            if (!err) {
                
                if(tillResults == null || tillResults == "null" ) {
                    var getpro = {}    
                    getpro.error = "error"
                    getpro.flag = 2;
                   deferred.resolve(getpro); 
              } else {
                var tills = {}
                tills.results = tillResults
                tills.flag = 2;

                deferred.resolve(tills);
              }
               
            } else {

                deferred.reject(err.name + ': ' + err.message);
            }
        });
        return deferred.promise;

    } else if (till.tilltypeid.flag == 3) {

        var deferred = Q.defer();
        var userId = new mongoose.Types.ObjectId(till.merchantId);
        var tertiaryid = new mongoose.Types.ObjectId(till.tilltypeid.id);

        tilldetails.aggregate([
            { '$unwind': '$secondary' },
            { '$unwind': '$secondary.tertiary' },
            {
                '$match': {
                    'merchantId': userId,
                    'secondary.tertiary._id': tertiaryid
                }
            },

            { $sort: { dateadded: -1 } }]).exec(function (err, tilllist) {

                if (!err) {
                    if(tilllist == null || tilllist == "null" ) {
                        var getpro = {}    
                        getpro.error = "error"
                        getpro.flag = 3;
                       deferred.resolve(getpro); 
                  } else {
                    var tills = {}
                    tills.results = tilllist
                    tills.flag = 3;
                    deferred.resolve(tills);
                  }
                   
                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }
            });
        return deferred.promise;
    }
}


function updatetilltypename(tills) {

    if (tills.flag.flag == 1) {
        var deferred = Q.defer();
        tilldetails.findOne({ merchantId: new mongoose.Types.ObjectId(tills.merchantId) }, function (err, results) {
            if (!err) {

                results.name = tills.name;
                results.save(function (err) {
                    if (!err) {

                        var data = {};
                        data.string = 'Primary type updated successfully.';

                        deferred.resolve(data);
                    } else {
                        deferred.reject(err.name + ': ' + err.message);
                    }
                });
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        })
        return deferred.promise;

    } else if (tills.flag.flag == 2) {

        var deferred = Q.defer();
        tilldetails.update({
            merchantId: new mongoose.Types.ObjectId(tills.merchantId),
            "secondary._id": new mongoose.Types.ObjectId(tills.flag.id)
        }, { "$set": { "secondary.$.name": tills.name } }, function (err, results) {
            if (!err) {

                var data = {};
                data.string = 'Secondary type updated successfully.';

                deferred.resolve(data);

            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        })
        return deferred.promise;
    } else if (tills.flag.flag == 3) {


        var deferred = Q.defer();
        var userId = new mongoose.Types.ObjectId(tills.merchantId);
        var tertiaryid = new mongoose.Types.ObjectId(tills.flag.id);
        tilldetails.aggregate([
            { '$unwind': '$secondary' },
            { '$unwind': '$secondary.tertiary' },
            {
                '$match': {
                    'merchantId': userId,
                    'secondary.tertiary._id': tertiaryid
                }
            },

            { $sort: { dateadded: -1 } }]).exec(function (err, tilllist) {

                if (!err) {

                    var nameupdate = []
                    nameupdate._id = tilllist[0].secondary.tertiary._id
                    nameupdate.name = tills.name;
                    var merchantId = userId;
                    var secondaryid = tilllist[0].secondary._id;
                    var tertiaryid = tilllist[0].secondary.tertiary._id;

                    tilldetails.update(
                        {
                            merchantId: new mongoose.Types.ObjectId(merchantId),
                            'secondary': { $elemMatch: { '_id': new mongoose.Types.ObjectId(secondaryid) } }
                        },
                        {
                            '$pull': {
                                'secondary.$.tertiary': {
                                    '_id': new mongoose.Types.ObjectId(tertiaryid)
                                }
                            }
                        },
                        { multi: true },

                        function (err) {
                            if (err) {

                                deferred.reject(err.name + ': ' + err.message);
                            }
                            else {

                                merchantId = new mongoose.Types.ObjectId(merchantId);
                                secondaryid = new mongoose.Types.ObjectId(secondaryid);
                                tilldetails.update(
                                    { "merchantId": merchantId, "secondary._id": secondaryid },
                                    {
                                        "$push":
                                        {
                                            "secondary.$.tertiary":
                                            {
                                                "name": nameupdate.name,

                                            }
                                        }

                                    }, function (err, responce) {
                                        if (err) {
                                            deferred.reject(err.name + ': ' + err.message);

                                        } else {

                                            var data = {};
                                            data.string = 'Tertiary type updated successfully.';
                                            deferred.resolve(data);

                                        }
                                    })
                            }
                        });


                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }
            });
        return deferred.promise;

    }
}

module.exports = service;
