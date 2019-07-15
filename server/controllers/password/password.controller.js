var express = require('express');
var router = express.Router();
var passwordService = require('../../services/password.service');


exports.passwordmatch = function(req,res) {

   //return false;
    passwordService.passwordmatch(req.body)
  
        .then(function (password) {
            if (password) {
                
                res.send(password);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


