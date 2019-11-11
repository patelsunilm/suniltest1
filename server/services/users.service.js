var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var Users = require('../controllers/Users/users.model');// get our mongoose model
var appusers = require('../controllers/Users/appusers.model');
var Merchant = require('../controllers/Users/merchantcategories.model');
var cartdetails = require('../controllers/products/cartdetails.model')

var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');

var service = {};
service.authenticate = authenticate;
service.addsignupuser = addsignupuser;
service.addsecretValuedata = addsecretValuedata;
service.updateipaddress = updateipaddress;
service.submitgoogledetails = submitgoogledetails;
service.loginwithemail = loginwithemail;
service.loginwithmoblenumber = loginwithmoblenumber;
service.matchotp = matchotp;
service.getmerchantcategories = getmerchantcategories;
service.submitfacebookdetails = submitfacebookdetails;
service.selectMerchant = selectMerchant;
service.getlastfivemerchant = getlastfivemerchant;


function authenticate(email, password) {
    var deferred = Q.defer();

    Users.findOne({
        $and: [
            { $or: [{ "email": email }, { "phone": email }] },
        ]
    },

        function (err, user) {

            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }

            if (user && bcrypt.compareSync(password, user.password)) {


                if (user.userType == 'admin') {
                    deferred.resolve({
                        _id: user._id,
                        email: user.email,
                        userType: user.userType,
                        name: user.name,
                        secretquestion: user.secretquestion,
                        secretanswer: user.secretanswer,
                        image: user.image,
                        token: jwt.sign({ sub: user._id }, config.secret)
                    });
                } else {

                    if (user.status == true) {
                        deferred.resolve({
                            _id: user._id,
                            email: user.email,
                            userType: user.userType,
                            name: user.name,
                            secretquestion: user.secretquestion,
                            secretanswer: user.secretanswer,
                            ipaddress: user.ipaddress,
                            image: user.image,
                            token: jwt.sign({ sub: user._id }, config.secret)
                        });
                    } else {
                        var data = {};
                        data.string = 'You cannot logged in as your Status is off.';

                        deferred.resolve(data);
                    }
                }


            } else {

                deferred.resolve();
            }
        });

    return deferred.promise;

}


function addsignupuser(signupdata) {

    var deferred = Q.defer();
    var hashUserPassword = bcrypt.hashSync(signupdata.password, 10);

    Users.find({ email: signupdata.email }, function (err, result) {

        if (result.length > 0) {
            var data = {};
            data.string = 'Email already exist.';
            deferred.resolve(data);

        } else {

            var saveallsignup = new Users({

                name: signupdata.name,
                email: signupdata.email,
                password: hashUserPassword,
                address: signupdata.address,
                businessname: signupdata.BusinessName,
                secretquestion: signupdata.Secretquestion,
                secretanswer: signupdata.Secretanswer,
                ipaddress: signupdata.ipAddress,
                status: signupdata.status,
                uniqueid: signupdata.uniqueid,
                userType: signupdata.usertype,
                phone: signupdata.phone,
                cityid: signupdata.cityid,
                stateid: signupdata.stateid,
                countryid: signupdata.countriid,
                categoryid: signupdata.categoryid,
                fontcolor: signupdata.fontcolor,
                backgroundtheme: signupdata.backgroundtheme,
                image: signupdata.image,

            });
            saveallsignup.save(function (err, saveallsignup) {
                if (!err) {


                    var data = {};
                    data.string = 'You have signed up successfully.';
                    deferred.resolve(data);
                } else {

                    deferred.reject(err.name + ': ' + err.message);
                }
            })
        }
    })

    return deferred.promise;

}

function addsecretValuedata(data) {
    var deferred = Q.defer();

    Users.findOne({ $and: [{ _id: data._id }, { secretanswer: data.secretanswer.secretanswer }] }, function (err, getvalue) {


        if (!err) {
            if (getvalue) {
                var data = {};
                data.string = 'Login successfully.';
                deferred.resolve(data);

            } else {
                var data = {};
                data.string = 'Please enter right secret answer.';
                deferred.resolve(data);
            }

        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}



function updateipaddress(ipdata) {

    var deferred = Q.defer();

    Users.findOne({ _id: ipdata._id }, function (err, getvalue) {

        if (getvalue.secretanswer == ipdata.secretanswer) {

            Users.findById(ipdata._id, function (err, data) {

                if (!err) {
                    data.ipaddress = ipdata.ipAddress;
                    data.datemodified = Date.now();

                    data.save(function (err) {
                        if (!err) {
                            deferred.resolve(data);
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
    return deferred.promise;
}


function submitgoogledetails(googledata) {

    var deferred = Q.defer();

    Users.findOne({ email: googledata.email }, function (err, getresult) {
        if (getresult) {

            if (getresult.userType == 'Merchant') {

                Users.findOneAndUpdate({ _id: getresult._id }, {
                    googleid: googledata.googleid,
                    authToken: googledata.authToken,
                    datemodified: Date.now(),

                }, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    else {
                        deferred.resolve({
                            _id: user._id,
                            email: user.email,
                            userType: user.userType,
                            name: user.name,
                            googleid: user.googleid,
                            authToken: user.authToken,
                            token: jwt.sign({ sub: user._id }, config.secret),
                            secretquestion: user.secretquestion,
                            secretanswer: user.secretanswer,
                            image: user.image,
                            token: jwt.sign({ sub: user._id }, config.secret)
                        });
                    }
                })


            } else {

                var data = {};
                data.string = 'Admin could not access any social login.';
                deferred.resolve(data);

            }
        } else {

            var saveData = new Users({
                name: googledata.name,
                email: googledata.email,
                status: 'false',
                uniqueid: googledata.uniqueid,
                googleid: googledata.googleid,
                userType: googledata.userType,
                authToken: googledata.authToken,
                businessname: '',
                dateadded: Date.now(),
                datemodified: Date.now(),
            });

            saveData.save(function (err, user) {
                if (!err) {
                    deferred.resolve({
                        _id: user._id,
                        email: user.email,
                        userType: user.userType,
                        name: user.name,
                        googleid: user.googleid,
                        authToken: user.authToken,
                        token: jwt.sign({ sub: user._id }, config.secret)
                    });
                } else {

                    deferred.reject(err.name + ': ' + err.message);
                }
            });
        }

    })

    return deferred.promise;
}


function getmerchantcategories() {

    var deferred = Q.defer();

    Merchant.find(function (err, merchantcategories) {

        if (!err) {

            deferred.resolve(merchantcategories);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}


function loginwithemail(data) {

    var deferred = Q.defer();
    var string = data.email;
    var isEmail = string.includes("@");
    var email = '';

    var userType = 'user';
    var random = Math.floor(100 + Math.random() * 900);
    var random1 = Math.floor(100 + Math.random() * 900);
    var otp = random.toString() + random1.toString();

    var userdata =
    {
        "status": "1",
        "message": "OTP sent on Email Address",
        "data": {

        }
    }
    appusers.find({ $and: [{ email: data.email }] }
        , function (err, user) {
            if (err) {

                deferred.reject(err.name + ': ' + err.message);
            } else {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 25,
                    secure: false,
                    tls: {
                        rejectUnauthorized: false
                    },
                    pool: true,
                    auth: {
                        user: config.mail_user,
                        pass: config.mail_pass
                    }
                });

                var mailOptions = {
                    from: config.mail_user,
                    to: data.email, // list of receivers
                    subject: 'Account verification code', // Subject line
                    text: 'otp',
                    html: otp + ' is your verification code',
                };
                if (user == '') {
                    var saveuser = new appusers({
                        email: data.email,
                        otp: otp,
                        firstname: '',
                        lastname: '',
                        image: '',
                        phone: ''
                    });
                    saveuser.save(function (err, saveanewuser) {
                        if (!err) {

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    deferred.reject(err.name + ': ' + err.message);
                                } else {
                                    deferred.resolve(userdata);
                                }
                            });
                        }
                    })

                } else {

                    var email = user[0].email;
                    var id = user[0]._id

                    appusers.findOneAndUpdate({ _id: id }, { otp: otp }, function (err, data) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    deferred.reject(err.name + ': ' + err.message);
                                } else {
                                    deferred.resolve(userdata);
                                }
                            });
                        }
                        return deferred.promise;
                    })
                }
            }
        });
    // } else {

    //         send mobile phone text messages

    //         var number = Math.floor(100000 + Math.random() * 900000)
    //         var otp = number.toString();
    //         var phone = data.email

    //         const nexmo = new Nexmo({
    //             apiKey: 'bc107ac0',
    //             apiSecret: 'MzkndlVG1KXBfZts',
    //         });

    //         const from = 'Nexmo';
    //         const to = phone;
    //         const text = 'Hello from Nexmo';

    //         nexmo.message.sendSms(from, to, text);

    // }
    return deferred.promise;
}


function matchotp(data) {
    var deferred = Q.defer();
    appusers.findOne({ $and: [{ otp: data.otp }, { email: data.email }] }, function (err, user) {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            if (user == null || user == 'user' || user == '') {
                var userdata = {
                    "status": "0",
                    "message": "OTP does not match.",
                    "data":
                        {}
                }
            } else {
                var userdata =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        "userId": user._id,
                        "email": user.email,
                        "phone": user.phone,
                        "firstName": user.firstname,
                        "lastName": user.lastname,
                        "image": user.image,
                        "lastMerchantId": user.lastMerchantId == undefined ? '' : user.lastMerchantId
                    }
                }
                appusers.findOneAndUpdate({ _id: user._id }, {

                    deviceToken: data.DeviceToken == undefined ? '' : data.DeviceToken,
                    deviceType: data.DeviceType == undefined ? '' : data.DeviceType

                }, function (err, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    return deferred.promise;
                })
            }
            deferred.resolve(userdata);
        }
    })

    return deferred.promise;

}

function submitfacebookdetails(facebookdata) {
    var deferred = Q.defer();
    Users.findOne({ email: facebookdata.email }, function (err, getresult) {
        if (getresult) {
            if (getresult.userType == 'Merchant') {
                Users.findOneAndUpdate({ _id: getresult._id }, {
                    facebookid: facebookdata.facebookid,
                    authToken: facebookdata.authToken,
                    datemodified: Date.now(),

                }, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    else {
                        deferred.resolve({
                            _id: user._id,
                            email: user.email,
                            userType: user.userType,
                            name: user.name,
                            facebookid: user.facebookid,
                            authToken: user.authToken,
                            token: jwt.sign({ sub: user._id }, config.secret),
                            secretquestion: user.secretquestion,
                            secretanswer: user.secretanswer,
                            image: user.image,
                            token: jwt.sign({ sub: user._id }, config.secret)
                        });
                    }
                })
            } else {
                var data = {};
                data.string = 'Admin could not access any social login.';
                deferred.resolve(data);
            }
        } else {
            var saveData = new Users({
                name: facebookdata.name,
                email: facebookdata.email,
                status: 'false',
                uniqueid: facebookdata.uniqueid,
                facebookid: facebookdata.facebookid,
                userType: facebookdata.userType,
                authToken: facebookdata.authToken,
                businessname: '',
                dateadded: Date.now(),
                datemodified: Date.now(),
            });
            saveData.save(function (err, user) {
                if (!err) {
                    deferred.resolve({
                        _id: user._id,
                        email: user.email,
                        userType: user.userType,
                        name: user.name,
                        facebookid: user.facebookid,
                        authToken: user.authToken,
                        token: jwt.sign({ sub: user._id }, config.secret)
                    });
                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }
            });
        }

    })
    return deferred.promise;
}


function selectMerchant(data) {

    var userdara1 = {
        "status": "0",
        "message": "No records found",
        "data":
            {}
    }
    var deferred = Q.defer();

    appusers.findOne({ _id: data.userId }, { lastMerchant: { $elemMatch: { merchantId: data.merchantId } } }, function (err, results) {
        if (!err) {

            if (results == null || results == 'null') {
                deferred.resolve(userdara1);
            } else {

                if (results.lastMerchant.length > 0) {

                    results.lastMerchant[0].datemodified = Date.now();
                    results.save(function (err) {
                        if (!err) {

                            var usersid = data.userId;
                            var merchantId = data.merchantId;

                            cartdetails.update({ userId: usersid }, { $pull: { productdetails: { merchantId: merchantId } } }, function (err, cartresults) {
                                if (!err) {

                                    var userdata =
                                    {
                                        "status": "1",
                                        "message": "Successful",
                                        "data": {

                                        }
                                    }

                                    deferred.resolve(userdata);

                                } else {

                                    deferred.resolve(userdara1);
                                }
                            })
                        } else {

                            deferred.resolve(userdara1);
                        }
                    })

                } else {

                    appusers.findOneAndUpdate({ _id: data.userId }, {
                        $push:
                            { lastMerchant: [{ merchantId: data.merchantId }] }
                    }, function (err, merchant) {
                        if (!err) {

                            var userdata =
                            {
                                "status": "1",
                                "message": "Successful",
                                "data": {

                                }
                            }

                            deferred.resolve(userdata);
                        } else {

                            deferred.resolve(userdara1);
                        }

                    })
                }

            }
        } else {

            deferred.resolve(userdara1);
        }

    })
    return deferred.promise;

}



function getlastfivemerchant(data) {
    var deferred = Q.defer();
    appusers.aggregate([

        {
            "$match": {
                "_id": new mongoose.Types.ObjectId(data.userId)
            }
        },
        {
            '$unwind': '$lastMerchant'
        },
        {
            '$sort': {
                'lastMerchant.datemodified': -1
            }
        },
        {
            '$group': {
                '_id': null,
                'lastMerchant': {
                    '$push': {
                        "_id": '$lastMerchant._id',
                        "merchantId": '$lastMerchant.merchantId',
                        "dateadded": '$lastMerchant.dateadded',
                        "datemodified": '$lastMerchant.datemodified'
                    }
                }
            }
        },
        {
            '$project': {
                'lastMerchant': { '$slice': ['$lastMerchant', 0, 5] }
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "lastMerchant.merchantId",
                foreignField: "_id",
                as: "merchantdetails"
            }

        },
    ]).exec(function (err, merchanrdetails) {

        if (!err) {

            if (merchanrdetails == '' || merchanrdetails == null || merchanrdetails == 'null') {

                var countriesdetails = {
                    "status": "0",
                    "message": "No records found",
                    "data":
                        {}
                }
                deferred.resolve(countriesdetails);

            } else {


                var lastfivemerchnt = merchanrdetails[0].merchantdetails;
                var merchant = [];
                lastfivemerchnt.forEach(element => {

                    var merchantdetails = {}

                    merchantdetails.merchantId = element._id == undefined ? '' : element._id;
                    merchantdetails.name = element.name == undefined ? '' : element.name;

                    merchant.push(merchantdetails);


                });

                var userdata =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        merchant
                    }
                }

                deferred.resolve(userdata);

            }


        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}



function loginwithmoblenumber(userdetails) {

    var deferred = Q.defer();
    var userType = 'user';
    var random = Math.floor(100 + Math.random() * 900);
    var random1 = Math.floor(100 + Math.random() * 900);
    var otp = random.toString() + random1.toString();

    var userdata =
    {
        "status": "1",
        "message": "OTP sent on Mobile Number",
        "data": {

        }
    }
    var mobilenumber = parseInt(userdetails.mobileNumber);

    appusers.find({ $and: [{ phone: mobilenumber }] }
        , function (err, user) {
            if (err) {

                deferred.reject(err.name + ': ' + err.message);
            } else {

                if (user == '') {
                    var saveuser = new appusers({
                        email: '',
                        otp: otp,
                        firstname: '',
                        lastname: '',
                        image: '',
                        phone: mobilenumber,
                        countryCode: userdetails.countryCode
                    });
                    saveuser.save(function (err, saveanewuser) {
                        if (!err) {


                            deferred.resolve(userdata);
                        } else {


                            deferred.reject(err.name + ': ' + err.message);
                        }
                    })

                } else {

                    var id = user[0]._id

                    appusers.findOneAndUpdate({ _id: id }, { otp: otp }, function (err, data) {
                        if (err) {

                            deferred.reject(err);

                        } else {

                            deferred.resolve(userdata);

                        }
                        return deferred.promise;
                    })
                }
            }
        });
    return deferred.promise;
}
module.exports = service;
