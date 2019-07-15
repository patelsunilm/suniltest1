var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var Users = require('../controllers/Users/users.model');// get our mongoose model

var service = {};
service.authenticate = authenticate;
service.addsignupuser = addsignupuser

function authenticate(email, password) {

    var deferred = Q.defer();
    Users.findOne({ email: email }, function (err, user) {
        if (err) {
            console.log(err);
            deferred.reject(err.name + ': ' + err.message);
        }

        if (user && bcrypt.compareSync(password, user.password)) {
            deferred.resolve({
                _id: user._id,
                email: user.email,
                userType: user.userType,
                name: user.name,
                token: jwt.sign({ sub: user._id }, config.secret)
            });

        } else {

            deferred.resolve();
        }
    });

    return deferred.promise;

}


function addsignupuser(signupdata) {

var deferred = Q.defer();
var saveallsignup = new Users({
   
    name : signupdata.name,
    email : signupdata.email,
    password : signupdata.password,
    address: signupdata.address,
    businessname : signupdata.BusinessName,
    secretquestion : signupdata.Secretquestion,
    secretanswer : signupdata.Secretanswer,
    ipaddress : signupdata.ipAddress,
    status : signupdata.status,
    uniqueid: signupdata.uniqueid,
    userType : signupdata.usertype
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

module.exports = service;
