var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
const rgbHex = require('rgb-hex');

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
service.getMerchantCategories = getMerchantCategories;
service.SearchMerchant = SearchMerchant;

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
            $lookup: {
                from: "merchantcategories",
                localField: "merchantcatid",
                foreignField: "_id",
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
                        cond: { $eq: ["$$merchantcategoriename._id", "$merchantcatid"] }
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
                merchantdetails.merchantId = element._id;
                merchantdetails.name = element.name == undefined ? '' : element.name;
                merchantdetails.email = element.email == undefined ? '' : element.email;
                merchantdetails.status = element.status == undefined ? '' : element.status;

                merchantdetails.address = element.address == undefined ? '' : element.address;
                merchantdetails.phone = element.phone == undefined ? '' : element.phone;
                merchantdetails.businessName = element.businessname == undefined ? '' : element.businessname;
                merchantdetails.image = element.image == undefined ? '' : element.image;
                merchantdetails.backgroundTheme = (element.backgroundtheme == undefined || element.backgroundtheme == '' || element.backgroundtheme == null || element.backgroundtheme == 'null' || !element.backgroundtheme) ? '' : rgbHex(element.backgroundtheme);
                merchantdetails.fontColor = (element.fontcolor == undefined || element.fontcolor == '' || element.fontcolor == null || element.fontcolor == 'null' || !element.fontcolor) ? '' : rgbHex(element.fontcolor);
                merchantdetails.cityId = element.cityid == undefined ? '' : element.cityid;
                merchantdetails.stateId = element.stateid == undefined ? '' : element.stateid;
                merchantdetails.countryId = element.countryid == undefined ? '' : element.countryid;
                merchantdetails.categoryId = element.merchantcatid == undefined ? '' : element.merchantcatid;
                merchantdetails.ipAddress = element.ipaddress == undefined ? '' : element.ipaddress;
                merchantdetails.countryName = element.countriesname.length > 0 ? element.countriesname[0].name : "";
                merchantdetails.stateName = element.statename.length > 0 ? element.statename[0].name : "";
                merchantdetails.cityName = element.cityname.length > 0 ? element.cityname[0].name : "";
                merchantdetails.merchantCatName = element.merchantcatname.length > 0 ? element.merchantcatname[0].merchantcatname : "";
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

            
              var businessname = new RegExp("^" + merchantdata.businessname +  "$", "i")
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
                    console.log('err');
                    console.log(err);
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


function getMerchantCategories() {

    var deferred = Q.defer();

    merchantcategory.find(function (err, merchantcategories) {
        if (!err) {

            if (merchantcategories) {

                var allcategories = [];
                merchantcategories.forEach(element => {

                    var category = {}

                    category.merchantCatId = element._id == undefined ? '' : element._id,
                        category.merchantCatName = element.merchantcatname == undefined ? '' : element.merchantcatname

                    allcategories.push(category);

                });

                var merchentcatdetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data":
                        allcategories
                }


            } else {
                var merchentcatdetails = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }

            }
            deferred.resolve(merchentcatdetails);
        } else {
            deferred.reject(err.name + ': ' + err.message);

        }
    })
    return deferred.promise;

}


function SearchMerchant(merchantdetail) {

    var deferred = Q.defer();
    var countrieId = parseInt(merchantdetail.countrieId)

    var merchentcatdetails = {
        "status": "0",
        "message": "no data found",
        "data":
            {}
    }

    users.find({ $and: [{ merchantcatid: merchantdetail.merchantCatId }, { countryid: countrieId }] }, function (err, MerchantResults) {
        if (!err) {
            if (MerchantResults == '') {
                deferred.resolve(merchentcatdetails);
            } else {
                var allmerchant = [];
                MerchantResults.forEach(element => {
                    var merchantdetails = {}
                    merchantdetails.merchantId = element._id;
                    merchantdetails.name = element.name == undefined ? '' : element.name;
                    merchantdetails.email = element.email == undefined ? '' : element.email;
                    merchantdetails.backgroundTheme = (element.backgroundtheme == undefined || element.backgroundtheme == '' || element.backgroundtheme == null || element.backgroundtheme == 'null' || !element.backgroundtheme) ? '' : rgbHex(element.backgroundtheme);
                    merchantdetails.fontColor = (element.fontcolor == undefined || element.fontcolor == '' || element.fontcolor == null || element.fontcolor == 'null' || !element.fontcolor) ? '' : rgbHex(element.fontcolor);
                    merchantdetails.merchantCatId = element.merchantcatid == undefined ? '' : element.merchantcatid;
                    allmerchant.push(merchantdetails);
                });

                var merchentdetails = {
                    "status": "1",
                    "message": "Sucess",
                    "data": {
                        allmerchant
                    },
                }

                deferred.resolve(merchentdetails);

            }
        } else {

            deferred.resolve(merchentcatdetails);
        }

    })
    return deferred.promise;
}

module.exports = service;
