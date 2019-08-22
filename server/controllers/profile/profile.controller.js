var express = require('express');

var profileService = require('../../services/profile.service');

exports.getprofileInfo = function (req, res) {

    profileService.getprofileInfo(req.params.userId)
        .then(function (getprofiledata) {
            if (getprofiledata) {

                res.send(getprofiledata);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

exports.updateprofile = function (req, res) {

    profileService.updateprofile(req.body)
        .then(function (updatedata) {
            if (updatedata) {
                res.send(updatedata);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


exports.getcountries = function (req, res) {
 
    profileService.getcountries(req.body)
    .then(function (countries) {
        if (countries) {
            res.send(countries);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}

exports.getAllcountries = function(req, res) {
   
    profileService.getAllcountries(req.body)
    .then(function (countries) {
        if (countries) {
            res.send(countries);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}



exports.getstates = function(req, res) {
   

    profileService.getstates(req.body.countrieId)
    .then(function (states) {
        if (states) {
            res.send(states);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  
}

exports.getcity = function(req, res) {
   

    profileService.getcity(req.body.stateId)
    .then(function (city) {
        if (city) {
            res.send(city);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  
}


exports.getuserprofile = function(req, res) {
 
    
    profileService.getuserprofile(req.body)
 
    .then(function (userprofile) {
        if (userprofile) {
            res.send(userprofile);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });   
}