var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongoose = require('mongoose');

var products = require('../controllers/products/products.model');// get our mongoose model
var faq = require('../controllers/faq/faq.model');
var users = require('../controllers/Users/users.model');
var appuser = require('../controllers/Users/appusers.model');


var service = {};

service.getAllusercount = getAllusercount;
service.getAllcountfeedback = getAllcountfeedback;
service.getAllmerchantcounts = getAllmerchantcounts;
service.getAllcountproducts = getAllcountproducts;
service.getAllcountfaqs = getAllcountfaqs;

function getAllusercount() {


    var deferred = Q.defer();
    appuser.count(function (err, allappusers) {
        if (!err) {

            deferred.resolve(allappusers);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;



}

function getAllcountfeedback() {



    var deferred = Q.defer();
    faq.count(function (err, feedback) {
        if (!err) {

            deferred.resolve(feedback);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}

function getAllmerchantcounts() {
    var deferred = Q.defer();


    users.count({ userType: 'Merchant' }, function (err, merchantcount) {
        if (!err) {

            deferred.resolve(merchantcount);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}


function getAllcountproducts(userId) {

    var deferred = Q.defer();
    var userId = new mongoose.Types.ObjectId(userId);

    products.count({ merchantid: userId }, function (err, data) {
        if (!err) {

            deferred.resolve(data);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}



function getAllcountfaqs(userId) {
    var deferred = Q.defer();

    faq.count({ $or: [{ "status": true }, { userId: userId }] }, function (err, data) {
        if (!err) {

            deferred.resolve(data);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}


module.exports = service;