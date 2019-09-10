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


exports.getTillManagementDetails = function(req, res) {

    tillManagementservice.getTillManagementDetails(req.body.merchantId)
    .then(function (tillmanagementdetails) {

        if (tillmanagementdetails) {

            res.send(tillmanagementdetails);

        } else {
           
          
            res.send(tillmanagementdetails);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  
}



exports.deletetilltypename = function(req , res) {
  
    tillManagementservice.deletetilltypename(req.body)
    .then(function (data) {
           
      

        res.json(data);
    })
    .catch(function (err) {

       
        res.status(400).send(err);
    });
}


exports.getTillnametbyId = function(req , res) {
 
 
    tillManagementservice.getTillnametbyId(req.body)
    .then(function (getname) {

        if (getname) {

            res.send(getname);

        } else {
           
          
            res.send(getname);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  
}

exports.updatetilltypename = function(req , res) {


    tillManagementservice.updatetilltypename(req.body)
    .then(function (updatename) {

        if (updatename) {

            res.send(updatename);

        } else {
           
          
            res.send(updatename);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  

}