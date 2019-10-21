var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var appuser = require('../controllers/Users/appusers.model');
var cartdetails = require('../controllers/products/cartdetails.model');

var service = {};
service.GetallUsersDetails = GetallUsersDetails;
service.deleteappuser = deleteappuser;
service.getuserbyId = getuserbyId;
service.updateuserdetails = updateuserdetails;
service.UserLogout = UserLogout;
service.getCartDetails = getCartDetails;


function GetallUsersDetails() {

    var deferred = Q.defer();

    appuser.find(function (err, data) {

        if (!err) {
            deferred.resolve(data);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}


function deleteappuser(userid) {

    var deferred = Q.defer();
    appuser.deleteOne({ _id: new mongoose.Types.ObjectId(userid) },
        function (err) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            else {

                var data = {};
                data.string = 'Product deleted successfully.';
                deferred.resolve(data);
            }

        });
    return deferred.promise;
}


function getuserbyId(userid) {
    var deferred = Q.defer();

    appuser.findOne({ _id: userid }, function (err, getuser) {
        if (!err) {

            deferred.resolve(getuser);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });

    return deferred.promise;

}


function updateuserdetails(userdata) {

    var deferred = Q.defer();

    var id = new mongoose.Types.ObjectId(userdata.id);

    var email = new RegExp("^" + userdata.email + "$", "i")
    appuser.find({ $and: [{ email: email }, { _id: { $ne: id } }] }, function (err, getappuserdata) {
        if (getappuserdata.length > 0) {

            var data = {};
            data.string = 'Email is already exist.';
            deferred.resolve(data);

        } else {

            appuser.findOneAndUpdate({ _id: id }, {
                image: userdata.image,
                email: userdata.email,
                firstname: userdata.firstname,
                lastname: userdata.lastname,
                phone: userdata.phone,

            }, function (err, updateuserprofile) {

                if (!err) {
                    deferred.resolve(updateuserprofile);
                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }
            })

        }
    })

    return deferred.promise;
}


function UserLogout(user) {

    var deferred = Q.defer();
    appuser.update({ _id: user.userId }, {
        deviceToken: ""

    }, function (err, updateuserprofile) {
        if (!err) {

            var userlogoutresponce = {
                "status": "1",
                "message": "Success",
                "data":
                    {}
            }


        } else {

            var userlogoutresponce = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }
        }

        deferred.resolve(userlogoutresponce);
    })
    return deferred.promise;

}

function getCartDetails(cartid) {

    var startlimit = parseInt(cartid.startLimit);
    var endlimit = parseInt(cartid.endLimit);
    var deferred = Q.defer();
    var usercartresponce = {
        "status": "0",
        "message": "no data found",
        "data":
            {}
    }

    cartdetails.findOne({ userId: cartid.userId }, { productdetails: { $slice: [startlimit, endlimit] } }, function (err, cartresults) {
        if (!err) {

            if (cartresults == null || cartresults == 'null') {
                deferred.resolve(usercartresponce);

            } else {

                if (cartresults.productdetails == '' || cartresults.productdetails == null || cartresults.productdetails == 'null') {

                    deferred.resolve(usercartresponce);

                } else {

                    var allproductdetails = [];

                    cartresults.productdetails.forEach(element => {
                        var cart = {}
                        cart.productId = element.productId == undefined ? '' : element.productId;
                        cart.image = element.image == undefined ? '' : element.image;
                        cart.productName = element.productName == undefined ? '' : element.productName;
                        cart.costPrice = element.costPrice == undefined ? '' : element.costPrice;
                        cart.markUp = element.markUp == undefined ? '' : element.markUp.toString();
                        cart.sellingPrice = element.sellingPrice == undefined ? '' : element.sellingPrice.toString();
                        cart.merchantId = element.merchantId == undefined ? '' : element.merchantId;
                        cart.barCode = element.barcode == undefined ? '' : element.barcode;
                        cart.quantity = element.quantity == undefined ? '' : element.quantity.toString();
                        // cart.tillTypeId = element.tillTypeId == undefined ? '' : element.tillTypeId;
                       
                        allproductdetails.push(cart);

                    });
               
                    cartdetails.findOne({ userId: cartid.userId }, function (err, productcount) {

                        if (!err) {

                            var producrsresponce = {
                                "status": "1",
                                "message": "Success",
                                "data":
                                {
                                    totalCounts: productcount.productdetails.length,
                                    allproductdetails
                                }
                            }
                            deferred.resolve(producrsresponce);
                        }
                    })
                }
            }
        } else {
            deferred.resolve(usercartresponce);
        }
    })
    return deferred.promise;
}

module.exports = service;
