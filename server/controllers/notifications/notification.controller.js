var express = require('express');
var router = express.Router();
var notificationsService = require('../../services/notification.service');

exports.addnotification = function (req, res) {
   
    notificationsService.addnotification(req.body)
        .then(function (notification) {
            if (notification) {
                res.send(notification);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });


}