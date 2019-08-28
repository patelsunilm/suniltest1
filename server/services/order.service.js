var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var orders = require('../controllers/order/order.model');


var service = {};
service.getAllorders = getAllorders;
service.getAllproductorderdetails = getAllproductorderdetails;


function getAllorders(merchantId, userType) {

  var deferred = Q.defer();
  var merchantIddata = new mongoose.Types.ObjectId(merchantId);
  if (userType == 'admin') {

    orders.aggregate([
      {
        $lookup: {
          from: "appusers",
          localField: "userId",
          foreignField: "_id",
          as: "appuserdata"
        }
      }]).exec(function (err, getdata) {

        if (!err) {
          deferred.resolve(getdata);
        } else {
          deferred.reject(err.name + ': ' + err.message);
        }
      });

  } else {

    orders.aggregate([
      {
        '$match': {
          merchantId: merchantIddata
        }
      },
      {
        $lookup: {
          from: "appusers",
          localField: "userId",
          foreignField: "_id",
          as: "appuserdata"
        }
      }]).exec(function (err, getdata) {

        if (!err) {
          deferred.resolve(getdata);
        } else {
          deferred.reject(err.name + ': ' + err.message);
        }
      });

  }

  return deferred.promise;
}



function getAllproductorderdetails(appuserId) {
  var deferred = Q.defer();
  var appuserId = new mongoose.Types.ObjectId(appuserId);

  orders.findOne(appuserId, function (err, data) {
    if (!err) {
      deferred.resolve(data);
    } else {
      deferred.reject(err.name + ': ' + err.message);
    }
  });
  return deferred.promise;

}


module.exports = service;

