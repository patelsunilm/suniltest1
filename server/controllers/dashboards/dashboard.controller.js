var express = require('express');
var router = express.Router();

var dashboardservice = require('./../../services/dashboard.service')


exports.getAllcountsproducts = function(req, res) {
   
 
    dashboardservice.getAllcountsproducts(req.params.userId)
    .then(function (getproductdata) {

        if (getproductdata) {

            res.send(getproductdata);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.getAllcountfaqs = function(req, res) {
   
 
    dashboardservice.getAllcountfaqs(req.params.userId)
    .then(function (getAllcountfaqs) {

        if (getAllcountfaqs) {

            res.send(getAllcountfaqs);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
