var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var Users = require('../controllers/Users/users.model');// get our mongoose model

var service = {};
service.authenticate = authenticate;
service.addsignupuser = addsignupuser;
service.addsecretValuedata = addsecretValuedata;
service.updateipaddress = updateipaddress;
service.submitgoogledetails = submitgoogledetails;


function authenticate(email, password) {

    var deferred = Q.defer();
    Users.findOne({ email: email }, function (err, user) {

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
        userType: signupdata.usertype
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


module.exports = service;
