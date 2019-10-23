var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongoose = require('mongoose');

var diary = require('../controllers/diary/diary.model');// get our mongoose model


var service = {};

service.addEventdetails = addEventdetails;
service.getaEventDetails = getaEventDetails;
service.updateEvents = updateEvents;
service.deleteEvents = deleteEvents;
function addEventdetails(eventDetails) {

    var deferred = Q.defer();
    var startdate = new Date(eventDetails.start)
    var enddate = new Date(eventDetails.end)
    startdate.setDate(startdate.getDate())
    enddate.setDate(enddate.getDate())
    var savediarydetials = new diary({
        title: eventDetails.title,
        notes: eventDetails.meta.notes,
        startDate: startdate,
        endDate: enddate,
        merchantId : eventDetails.merchantId
    });
    savediarydetials.save(
        function (err, saveEventDetails) {
            if (!err) {

                deferred.resolve(saveEventDetails);
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        })

    return deferred.promise;

}


function getaEventDetails(merchantId) {

    var deferred = Q.defer();
    var userId = new mongoose.Types.ObjectId(userId);

    diary.find({ merchantId: merchantId }, function (err, getAllEventsDetails) {
        if (!err) {
          
          eventsdata = []; 
          getAllEventsDetails.forEach(element => {
            var event = {}
            var meta = {}
            event._id = element._id
            event.title = element.title
            event.start = new Date(element.startDate)
            event.end = new Date(element.endDate)
            meta.notes = element.notes;
            meta.location = element._id;  
            event.meta = meta;
            eventsdata.push(event);
           });
            deferred.resolve(eventsdata);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}

function updateEvents(eventDetails) {
    
    var deferred = Q.defer();
    var startdate = new Date(eventDetails.start)
    var enddate = new Date(eventDetails.end)
    startdate.setDate(startdate.getDate() + 1)
    enddate.setDate(enddate.getDate() + 1)

    diary.findOneAndUpdate({ _id: eventDetails.meta.location}, {
    title : eventDetails.title,
    notes: eventDetails.meta.notes,
    startDate : startdate,
    endDate : enddate
    }, function (err, updatevents) {

        if (!err) {

            
            deferred.resolve(updatevents);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}


function deleteEvents(eventsid) {
    var deferred = Q.defer();
    var id = new mongoose.Types.ObjectId(eventsid);
    diary.deleteOne(
        { _id: new mongoose.Types.ObjectId(id) },
        function (err) {
            if (err) {
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                var data = {};
               
                deferred.resolve(data);
            }

        });
    return deferred.promise;
}
  

module.exports = service;