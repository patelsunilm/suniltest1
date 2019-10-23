var express = require('express');
var router = express.Router();

var diaryservice = require('./../../services/diary.service')



exports.addEventdetails = function (req, res) {

    diaryservice.addEventdetails(req.body)

     .then(function (getdiarydetilas) {
        if (getdiarydetilas) {
            res.send(getdiarydetilas);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}



exports.getaEventDetails = function (req, res) {

    diaryservice.getaEventDetails(req.params.merchantId)

     .then(function (getdiarydetilas) {
        if (getdiarydetilas) {
            res.send(getdiarydetilas);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}


exports.deleteEvents = function (req, res) {

    diaryservice.deleteEvents(req.params.eventId)

     .then(function (deleteEvent) {
        if (deleteEvent) {
            res.send(deleteEvent);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}

exports.updateEvents = function (req, res) {

    diaryservice.updateEvents(req.body)

     .then(function (updateDetails) {
        if (updateDetails) {
            res.send(updateDetails);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}
// router.delete('/diary/deleteEvents/:eventId', diarys.deleteEvents);
// router.post('/diary/updateEvents', diarys.updateEvents);




