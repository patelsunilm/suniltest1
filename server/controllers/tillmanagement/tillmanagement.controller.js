var express = require('express');
var router = express.Router();

var tillManagementservice = require('./../../services/tillmanagement.service');




exports.getalltillType = function(req, res) {   
    tillManagementservice.getalltillType()
    .then(function (tilltype) {

        if (tilltype) {

            res.send(tilltype);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  
}


exports.addtilldetails = function(req , res) {
   
    tillManagementservice.addtilldetails(req.body)
    .then(function (tilldetails) {

        if (tilldetails) {

            res.send(tilldetails);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  
}


exports.getAllsecondarytilltype = function(req, res) {

  
    tillManagementservice.getAllsecondarytilltype(req.body.merchantId)
    .then(function (secoandrydetails) {

        if (secoandrydetails) {

            res.send(secoandrydetails);

        } else {
           
          
            res.send(secoandrydetails);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  

}