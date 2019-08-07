var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var Users = require('../controllers/Users/users.model');// get our mongoose model

var appusers = require('../controllers/Users/appusers.model');

var Merchant = require('../controllers/Users/merchantcategories.model');



var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');


var service = {};
service.authenticate = authenticate;
service.addsignupuser = addsignupuser;
service.addsecretValuedata = addsecretValuedata;
service.updateipaddress = updateipaddress;
service.submitgoogledetails = submitgoogledetails;
service.sendotp = sendotp;
service.matchotp = matchotp;
service.getmerchantcategories = getmerchantcategories;
service.submitfacebookdetails = submitfacebookdetails;



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'swatisuthar1494@gmail.com',
        pass: 'swati1494'
    }
});

function authenticate(email, password) {
    var deferred = Q.defer();

    Users.findOne({
        $and: [
            { $or: [{ "email": email }, { "phone": email }] },
        ]
    },

        function (err, user) {

            if (err) {
                console.log(err);
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
        cityid :signupdata.cityid ,
        stateid :signupdata.stateid ,
        countryid :signupdata.countriid ,
        categoryid :signupdata.categoryid,
        fontcolor :signupdata.fontcolor,
        backgroundtheme :signupdata.backgroundtheme,
        image :signupdata.image,
        
    });

    saveallsignup.save(function (err, saveallsignup) {
        if (!err) {


            deferred.resolve(saveallsignup);
        } else {
            deferred.reject(err.name + ': ' + err.message);
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
                status: 'true',
                uniqueid: googledata.uniqueid,
                googleid: googledata.googleid,
                userType: googledata.userType,
                authToken: googledata.authToken,
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
                    console.log(err);
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



function sendotp(data) {

    var deferred = Q.defer();
    var string = data.email;
    var isEmail = string.includes("@");
    var email = '';

    if (isEmail) {

        var deferred = Q.defer();
        var userType = 'user';
        var random = Math.floor(100 + Math.random() * 900);
        var random1 = Math.floor(100 + Math.random() * 900);
        var otp = random.toString() + random1.toString();

        var mailOptions = {

            from: 'swatisuthar1494@gmail.com',
            to: data.email,
            text: 'This Is Your Link To Reset Password',
            html: otp
        };
        var userdata =
        {
            "status": "1",
            "message": "Successful",
            "data": {

            }
        }
        appusers.find({ $and: [{ email: data.email }] }
            , function (err, user) {
                if (err) {

                    deferred.reject(err.name + ': ' + err.message);
                } else {
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

                                        console.log(error);
                                    } else {

                                        deferred.resolve(userdata);

                                    }
                                });


                            } else {

                                deferred.reject(err.name + ': ' + err.message);
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

                                        console.log(error);
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
    } else {
        //     var number = Math.floor(100000 + Math.random() * 900000)
        //     var otp = number.toString();
        //     var phone = data.email

        //     const nexmo = new Nexmo({
        //         apiKey: 'bc107ac0',
        //         apiSecret: 'MzkndlVG1KXBfZts',
        //     });

        //     const from = 'Nexmo';
        //     const to = phone;
        //     const text = 'Hello from Nexmo';

        //     nexmo.message.sendSms(from, to, text);

    }
    return deferred.promise;
}


function matchotp(data) {

    var deferred = Q.defer();
    appusers.findOne({ "otp": data.otp }, function (err, user) {
        if (err) {

            deferred.reject(err.name + ': ' + err.message);

        } else {

            if (user == null || user == 'user') {
                var userdata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }

            } else {
               
                var userdata =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        "userid": user._id,
                        "email": user.email,
                        "phone": user.phone,
                        "name": user.name,
                        "firstname": user.firstname,
                        "lastname": user.lastname,
                        "image": user.image
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
                status: 'true',
                uniqueid: facebookdata.uniqueid,
                facebookid: facebookdata.facebookid,
                userType: facebookdata.userType,
                authToken: facebookdata.authToken,
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
                    console.log(err);
                    deferred.reject(err.name + ': ' + err.message);
                }
            });
        }

    })

    return deferred.promise;
}



module.exports = service;
