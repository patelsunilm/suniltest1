var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var AWS = require('aws-sdk');
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
service.getAllUser = getAllUser;
service.chatuser = chatuser;








//aws credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAJRCOCZM7YVPHCJRA";
AWS.config.secretAccessKey = "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";
AWS.config.region = "us-east-1";
AWS.config.apiVersions = {
    "s3": "2012-10-17"
}


function GetallUsersDetails() {

    var deferred = Q.defer();

    appuser.find(function (err, data) {

        if (!err) {
            
            deferred.resolve(data);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });
    return deferred.promise;

}


function deleteappuser(userid) {
    
    var deferred = Q.defer();
    appuser.findOne({_id: new mongoose.Types.ObjectId(userid) }, function (err, getuser) {
        if (!err) {

            var pro = getuser.image;
            var sep = pro.split("https://smaf.s3.us-east-2.amazonaws.com/smaf/uploads/");
            appuser.deleteOne({ _id: new mongoose.Types.ObjectId(userid) },
                function (err) {
                    if (err) {

                        deferred.reject(err.name + ': ' + err.message);
                    }
                    else {

                        console.log(sep[1])
                        var s3 = new AWS.S3({ accessKeyId: "AKIAJRCOCZM7YVPHCJRA", secretAccessKey: "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" });
                        s3.deleteObject({
                            Bucket: 'smaf',
                            Key: 'smaf/uploads/' + sep[1]
                        }, function (err, datanew) {
                            if (!err) {
                                var data = {};
                                data.string = 'Product deleted successfully.';
                                deferred.resolve(data);
                            } else {
                                console.log('err');
                            }
                        })

                    }

                });

        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })


    return deferred.promise;

// return false


//     var deferred = Q.defer();
//     appuser.deleteOne({ _id: new mongoose.Types.ObjectId(userid) },
//         function (err) {
//             if (err) {
//                 deferred.reject(err.name + ': ' + err.message);
//             }
//             else {

//                 var data = {};
//                 data.string = 'Product deleted successfully.';
//                 deferred.resolve(data);
//             }

//         });
//     return deferred.promise;
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
            data.string = 'Email already exist.';
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
                "message": "No records found",
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
        "message": "No records found",
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


function getAllUser(userDetails) {

    
    var deferred = Q.defer();
    var startlimit = parseInt(userDetails.startLimit);
    var endlimit = parseInt(userDetails.endLimit);
    var id = new mongoose.Types.ObjectId(userDetails.userId);

    var username = new RegExp("^" + userDetails.searchTerm + "$", "i")
    appuser.find({$and : [{ _id: { $ne:  id }},{'$or' : [{firstname : username},{lastname : username}]} ]  }, function (err, responce) {
        if (!err) {
       
            if (responce == null || responce == 'null' || responce == '') {
                var userresponce = {
                    "status": "0",
                    "message": "No records found",
                    "data":
                        {}
                }
                deferred.resolve(userresponce);
            } else {

                var alluserdetails = [];

                responce.forEach(element => {
                    var user = {}
                  
                    user.email = element.email
                    user.firstName = element.firstname
                    user.lastName = element.lastname
                    user.phone = element.phone
                    user.countryCode = element.countryCode
                    user.image = element.image
                    user.userId = element._id
                    
                    alluserdetails.push(user);

                });
                var usersuccesresponce = {
                    "status": "1",
                    "message": "Success",
                    "data":
                    {
                      
                        alluserdetails
                    }
                }
                deferred.resolve(usersuccesresponce);

               
            }
        } else {

            var userresponce = {
                "status": "0",
                "message": "No records found",
                "data":
                    {}
            }
            deferred.resolve(userresponce);
        }
    }).skip(startlimit).limit(endlimit)
    return deferred.promise;
}





module.exports = service;
