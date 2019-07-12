var express = require('express');
var router = express.Router();
var userService = require('../../services/users.service');

router.post('/authenticate', authenticate);


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



