var express = require('express');
var router = express.Router();

var dashboardservice = require('./../../services/dashboard.service')



exports.getAllusercount = function (req, res) {
    
    dashboardservice.getAllusercount(req.params.userId)

    .then(function (allcounts) {
        if (allcounts) {
     
            res.send({ 'usercount': allcounts });
           
        } else {
            res.send({ 'usercount': 0 });
        }
    })
    .catch(function (err) {
        console.log(err);
        res.status(400).send(err);
    });

}

exports.getAllcountfeedback = function (req, res) {
    
    dashboardservice.getAllcountfeedback(req.params.userId)

    .then(function (allcounts) {
        if (allcounts) {
     
            res.send({ 'feedback': allcounts });
           
        } else {
            res.send({ 'feedback': 0 });
        }
    })
    .catch(function (err) {
        console.log(err);
        res.status(400).send(err);
    });

}
exports.getAllmerchantcounts = function (req, res) {
   
    dashboardservice.getAllmerchantcounts(req.params.userId)

    .then(function (allcounts) {
        if (allcounts) {
     
            res.send({ 'merchantcount': allcounts });
           
        } else {
            res.send({ 'merchantcount': 0 });
        }
    })
    .catch(function (err) {
        console.log(err);
        res.status(400).send(err);
    });

}