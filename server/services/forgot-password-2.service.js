var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var users = require('../controllers/Users/users.model');// get our mongoose model
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
// var sesTransport = require('nodemailer-ses-transport');
// var smtpPassword = require('aws-smtp-credentials');
var config = require('../config.json');

var service = {};

service.sendlink = sendlink;
service.resetpassword = resetpassword;

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'swatisuthar1494@gmail.com',
//         pass: 'swati1494'
//     }
// });


function sendlink(sendlinkdata, baseurl) {

    var deferred = Q.defer();

    users.findOne({ email: sendlinkdata.email }, function (err, password) {

        if (password) {

            var userid = password._id;


            // var mailOptions = {

            //     from: 'swatisuthar1494@gmail.com',
            //     to: sendlinkdata.email,
            //     text: 'This Is Your Link To Reset Password',
            //     html: '<a href="' + baseurl + '/#' + '/resetpassword/' + userid + '">Reset Password Link</a>',
            // };

            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }

            // });


            let transporter1 = nodemailer.createTransport({
                host: 'mail.finikart.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: config.mail_user, // generated ethereal user
                    pass: config.mail_pass // generated ethereal password
                }
            });

            // send mail with defined transport object
            let info = transporter1.sendMail({
                from: config.mail_user, // sender address
                to: sendlinkdata.email, // list of receivers
                text: 'This Is Your Link To Reset Password',
                html: '<a href="' + baseurl + '/#' + '/resetpassword/' + userid + '">Reset Password Link</a>',
            });


            var data = {};
            data.string = 'Email send successfully.';
            deferred.resolve(data);

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
        Password.password = hashUserPassword;
        Password.save(function (err) {
            if (!err) {

                deferred.resolve(Password);
            } else {

                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
        });
    })

    return deferred.promise;
}

module.exports = service;