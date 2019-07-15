var express = require('express');
var router = express.Router();
var merchentService = require('../../services/dashboard.service');

exports.getallMerchentsData = function (req, res) {

    merchentService.getallMerchentsData()
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