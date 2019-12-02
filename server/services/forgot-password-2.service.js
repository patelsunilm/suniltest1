var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var users = require('../controllers/Users/users.model');// get our mongoose model
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var config = require('../config.json');



var service = {};

service.sendlink = sendlink;
service.resetpassword = resetpassword;


function sendlink(sendlinkdata, baseurl) {
    var deferred = Q.defer();
    users.findOne({ email: sendlinkdata.email }, function (err, password) {
        if (password) {
            var userid = password._id;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 25,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                },
                pool: true,
                auth: {
                    user: config.mail_user,
                    pass: config.mail_pass
                }
            });
            var mailOptions = {
                from: config.mail_user,
                to: sendlinkdata.email,
                subject: 'Reset Password Link',
                html: '<p>Hello, ' + password.name + '</p> </br> <p>You have requested to reset your password to your SMAF account. Click on the link below to reset it</p></br> <a href="' + baseurl + '/#' + '/resetpassword/' + userid + '" target="_blank">Click Here</a> </br><p>If you did not request to reset your password, please ignore this mail, or let us know. </p></br><p>Regards,</p></br> <p>SMAF Team! </p>',
            };
           
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    var data = {};
                    data.string = error;
                    deferred.resolve(data);
                } else {
                    var id = new mongoose.Types.ObjectId(userid);
                    users.update({ _id: id }, {
                        flag: 0,
                        flagTime: Date.now()

                    }, function (err, updateproducts) {

                        if (!err) {
                            var data = {};
                            data.string = 'Email send successfully.';
                            deferred.resolve(data);
                        } else {
                            var data = {};
                            data.string = err;
                            deferred.resolve(data);
                        }
                    })
                }
            });

        } else {

            var data = {};
            data.string = 'Account does not exist.';
            deferred.resolve(data);

        }
    });
    return deferred.promise;
}

function resetpassword(resetpassworddata) {

    var deferred = Q.defer();
    var hashUserPassword = bcrypt.hashSync(resetpassworddata.newPassword, 10);

    users.findById(resetpassworddata.userid, function (err, Password) {
      
        if (err) {
            var arr={}
            arr.msg='Invalid URL!';
            deferred.resolve(arr);
        } else {
            var diff = Date.now() - (Password.flagTime);
            var diffInHours = diff / 1000 / 60 / 60; // Convert milliseconds to hours
           
            if (Password.flag == 1 && diffInHours>1) {
              
                var arr={}
                arr.msg='Reset Password link has been expired!';
                deferred.resolve(arr);
            } else {
                Password.flag = 1;
                Password.flagTime = Date.now();
                Password.password = hashUserPassword;
                Password.save(function (newErr) {
                    if (!newErr) {

                        deferred.resolve(Password);
                    } else {
                        var arr={}
                        arr.msg='Pleas try again later!';
                        deferred.resolve(arr);
                       
                    }
                });
            }
        }
    })

    return deferred.promise;
}

module.exports = service;