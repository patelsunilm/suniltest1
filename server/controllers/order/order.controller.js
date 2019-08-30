var express = require('express');
var router = express.Router();
var orderService = require('../../services/order.service');



exports.getAllorders = function (req, res) {

  orderService.getAllorders(req.params.merchantId, req.params.userType)
    .then(function (getdata) {
      if (getdata) {
        res.send(getdata);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

exports.getAllproductorderdetails = function (req, res) {

  orderService.getAllproductorderdetails(req.params.appuserId)
    .then(function (data) {
      if (data) {
        res.send(data);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}
