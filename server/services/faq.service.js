var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var faq = require('../controllers/faq/faq.model');// get our mongoose model
var mongoose = require('mongoose');


var service = {};
service.addfaqData = addfaqData;
service.getAllfaqs = getAllfaqs;
service.addFaqAnswerByAdmin = addFaqAnswerByAdmin;


function addfaqData(faqData) {
    var deferred = Q.defer();
    var userId = new mongoose.Types.ObjectId(faqData.userId)

    var saveFaq = new faq({
        userId: userId,
        faqquestion: faqData.faqquestion,
        status: faqData.status
    });
    saveFaq.save(function (err, saveFaq) {
        if (!err) {
            deferred.resolve(saveFaq);
        } else {
            console.log(err);
            deferred.reject(err.name + ': ' + err.message);
        }
    });


    return deferred.promise;
}

function getAllfaqs() {
    var deferred = Q.defer();

    faq.aggregate([
        {
            $match: { $and: [{ "status": true }] }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userdata"
            }
        }]).exec(function (err, getdata) {

            if (!err) {
                deferred.resolve(getdata);
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        });
    return deferred.promise;
}





function addFaqAnswerByAdmin(answerdata) {

    var deferred = Q.defer();

    faq.findById(answerdata.faqId, function (err, getdata) {
        if (!err) {
            getdata.faqanswer = answerdata.faqanswer
            getdata.status = 'true';
            getdata.datemodified = Date.now();

            getdata.save(function (err) {
                if (!err) {
                    deferred.resolve(getdata);
                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }
            });

        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}




module.exports = service;
