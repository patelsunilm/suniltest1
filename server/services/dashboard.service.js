var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var users = require('../controllers/Users/users.model');

var service = {};
service.getallMerchentsData = getallMerchentsData;


function getallMerchentsData() {
    var deferred = Q.defer();

    users.find({ userType: 'merchent' }, function (err, getData) {
        if (!err) {
            deferred.resolve(getData);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}

module.exports = service;