var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var users = require('../controllers/Users/users.model');

var merchantcategory = require('../controllers/Users/merchantcategories.model');

var faqs = require('../controllers/faq/faq.model');
var mongoose = require('mongoose');



var service = {};
service.getallMerchentsData = getallMerchentsData;
service.merchantStatusToggle = merchantStatusToggle;
service.updatemerchantData = updatemerchantData;
service.getmerchantDatabyId = getmerchantDatabyId;
service.deletemerchantData = deletemerchantData;
service.getMerchentsbyId = getMerchentsbyId;



function getallMerchentsData() {


    

    var deferred = Q.defer();
    users.aggregate([
        {
            $match: {

                "userType": 'Merchant'
            }
        },
        {
            $lookup: {
                from: "countries",
                localField: "countryid",
                foreignField: "id",
                as: "countriesname"
            }
        },
        {
            $lookup: {
                from: "states",
                localField: "country_id",
                foreignField: "stateid",
                as: "statename"
            }
        },
        {
            $lookup: {
                from: "cities",
                localField: "id",
                foreignField: "cityid",
                as: "citynameDetails"
            }
        },
        {
            $lookup : {
            from : "merchantcategories",
             localField : "merchantcatid",
              foreignField : "_id",
              as: "merchantcategoriename"
             }
        },

        {
            "$project": {
                "_id": 1,
                "name": 1,
                "email": 1,
                "password": 1,
                "address": 1,
                "businessname": 1,
                "secretquestion": 1,
                "secretanswer": 1,
                "status": 1,
                "uniqueid": 1,
                "userType": 1,
                "dateadded": 1,
                "datemodified": 1,
                "__v": 1,
                "backgroundtheme": 1,
                "fontcolor": 1,
                "cityid": 1,
                "countryid": 1,
                "merchantcatid": 1,
                "stateid": 1,
                "ipaddress": 1,
                "countriesname": 1,
                "statename": {
                    $filter: {
                        input: "$statename",
                        as: "statename",
                        cond: { $eq: ["$$statename.id", "$stateid"] }
                    }
                },
                "cityname": {
                    $filter: {
                        input: "$citynameDetails",
                        as: "citynameDetails",
                        cond: { $eq: ["$$citynameDetails.id", "$cityid"] }
                    }
                },
                "merchantcatname": {
                    $filter: {
                       input: "$merchantcategoriename",
                       as: "merchantcategoriename",
                       cond: { $eq: [ "$$merchantcategoriename._id", "$merchantcatid" ] }
                    }
                 },
            }
        },
        { $sort: { createddate: -1 } },
      
       
       ]).exec(function (err, getMerchentData) {
            if (!err) {


                var allmerchant = [];
                getMerchentData.forEach(element => {

                    var merchantdetails = {}
                    merchantdetails.merchantid =   element._id;
                    merchantdetails.name = element.name == undefined ? '' : element.name;
                    merchantdetails.email = element.email == undefined ? '' : element.email;
                    merchantdetails.address = element.address == undefined ? '' : element.address;
                    merchantdetails.phone = element.phone == undefined ? '' : element.phone;
                    merchantdetails.businessname = element.businessname == undefined ? '' : element.businessname;
                    merchantdetails.image = element.image == undefined ? '' : element.image;
                    merchantdetails.backgroundtheme = element.backgroundtheme == undefined ? '' : element.backgroundtheme;
                    merchantdetails.fontcolor = element.fontcolor == undefined ? '' : element.fontcolor;
                    merchantdetails.cityid = element.cityid == undefined ? '' : element.cityid;
                    merchantdetails.stateid = element.stateid == undefined ? '' : element.stateid;
                    merchantdetails.countryid = element.countryid == undefined ? '' : element.countryid;
                    merchantdetails.categoryid = element.merchantcatid == undefined ? '' : element.merchantcatid;
                    merchantdetails.ipaddress = element.ipaddress == undefined ? '' : element.ipaddress;
                    merchantdetails.countryname = element.countriesname.length > 0 ?element.countriesname[0].name:"";
                    merchantdetails.statename = element.statename.length > 0 ? element.statename[0].name : "";
                    merchantdetails.cityname = element.cityname.length > 0 ? element.cityname[0].name : "";
                    merchantdetails.merchantcatname = element.merchantcatname.length > 0 ?  element.merchantcatname[0].merchantcatname : "";
                    allmerchant.push(merchantdetails);

                });
                
                var merchentdata = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        allmerchant
                }

                deferred.resolve(merchentdata);
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
            faqs.deleteMany({ userId: new mongoose.Types.ObjectId(merchantDataId) }, function (err) {
                if (err) {
                    console.log(err);
                    deferred.reject(err.name + ': ' + err.message);
                }
                else {
                    deferred.resolve();
                }

            });
            deferred.resolve();
        }

    });

    return deferred.promise;

}

function getMerchentsbyId(catid) {

    
    var merchantId = new mongoose.Types.ObjectId(catid);

    var deferred = Q.defer();

    users.find({ merchantcatid: merchantId }, function (err, merchant) {
        if (!err) {

            deferred.resolve(merchant);

        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}



module.exports = service;
