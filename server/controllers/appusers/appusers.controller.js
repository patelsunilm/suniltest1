var express = require('express');

var appusersService = require('../../services/appusers.service');



exports.GetallUsersDetails = function(req, res) {

    appusersService.GetallUsersDetails()
   
    .then(function (userdetails) {
        if (userdetails) {
            res.send(userdetails);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}

exports.deleteappuser = function(req, res) {
    
    appusersService.deleteappuser(req.params.userid)
    .then(function (data) {
           
        res.json(data);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
  
}


exports.getuserbyId = function(req , res) {


    appusersService.getuserbyId(req.params.userid)
   
    .then(function (getuserdata) {
        if (getuserdata) {
            res.send(getuserdata);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });   
}


exports.updateuserdetails = function(req, res) {

    appusersService.updateuserdetails(req.body)
   
    .then(function (getuserdata) {
        if (getuserdata) {
            res.send(getuserdata);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });   
}