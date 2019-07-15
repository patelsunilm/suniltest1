var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var Password = require('../controllers/Users/users.model');// get our mongoose model
var mongoose = require('mongoose');

var service = {};
service.passwordmatch = passwordmatch;



function passwordmatch(passworddata) {

    var deferred = Q.defer();
    var oldPassword = passworddata.passworddata.oldPassword;
    var userId = passworddata.userId;
    var newPassword = passworddata.passworddata.newPassword;

    var _id = new mongoose.Types.ObjectId(passworddata.userId)

    Password.findOne(_id, function (err, user) {

        if (user && bcrypt.compareSync(oldPassword, user.password)) {

            var data = {};
            data.string = 'Password matched successfully.';
            if (bcrypt.compareSync(newPassword, user.password)) {

                var data = {};
                data.string = 'Your Password Is Same As Old Password Please Enter Another Password';
                deferred.resolve(data);
            }
            else {
                var hashUserPassword = bcrypt.hashSync(newPassword, 10);
                Password.findById(_id, function (err, Password) {
                    Password.password = hashUserPassword;
                    Password.save(function (err) {
                        if (!err) {

                            deferred.resolve(Password);
                        } else {

                            console.log(err);
                            deferred.reject(err.name + ': ' + err.message);
                        }
                    });

                })
            }
        } else {
            var data = {};
            data.string = 'Password unmatched.';
            deferred.resolve(data);
        }

    });
    return deferred.promise;
}



module.exports = service;