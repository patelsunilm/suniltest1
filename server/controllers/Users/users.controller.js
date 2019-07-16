var express = require('express');
var router = express.Router();
var userService = require('../../services/users.service');

router.post('/authenticate', authenticate);
router.post('/addsignupuser', addsignupuser);
router.post('/addsecretValuedata', addsecretValuedata)


module.exports = router;

function authenticate(req, res) {

    userService.authenticate(req.body.email, req.body.password)

        .then(function (user) {
            if (user) {

                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function addsignupuser(req, res) {

    userService.addsignupuser(req.body)

        .then(function (signup) {
            if (signup) {

                res.send(signup);
            } else {
                // authentication failed
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addsecretValuedata(req, res) {

    userService.addsecretValuedata(req.body)
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
