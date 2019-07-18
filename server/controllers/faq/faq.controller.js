var express = require('express');
var router = express.Router();
var faqService = require('../../services/faq.service');

exports.addfaqData = function (req, res) {

    faqService.addfaqData(req.body)
        .then(function (data) {
            if (data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


exports.getAllfaqs = function (req, res) {

    faqService.getAllfaqs()
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

exports.addFaqAnswerByAdmin = function (req, res) {

    faqService.addFaqAnswerByAdmin(req.body)
        .then(function (data) {
            if (data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}