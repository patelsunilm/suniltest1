var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongoose = require('mongoose');

var products = require('../controllers/products/products.model');// get our mongoose model
var faq = require('../controllers/faq/faq.model');

var service = {};

service.getAllcountsproducts = getAllcountsproducts;
service.getAllcountfaqs = getAllcountfaqs;


function getAllcountsproducts(userid) {


var deferred = Q.defer();
var id = new mongoose.Types.ObjectId(userid);
console.log('id');
console.log(id);
// products.count({ userid: id }, function (err, count) {
//     if (!err) {

//         deferred.resolve(count);
//     } else {

//         deferred.reject(err.name + ': ' + err.message);
//     }
// })
// return deferred.promise;
}

function getAllcountfaqs(userid) {
   
    // var deferred = Q.defer();
    // var id = new mongoose.Types.ObjectId(userid);
    // faq.count({ userid: id }, function (err, count) {
    //     if (!err) {

    //         deferred.resolve(count);
    //     } else {

    //         deferred.reject(err.name + ': ' + err.message);
    //     }
    // })
    // return deferred.promise;
}

module.exports = service;