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