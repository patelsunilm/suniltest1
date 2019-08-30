var express = require('express');
var router = express.Router();
var forgotpasswordService = require('../../services/forgot-password-2.service');

router.post('/sendlink', sendlink);
router.post('/resetpassword', resetpassword);

module.exports = router;


function sendlink(req, res) {

    forgotpasswordService.sendlink(req.body, req.headers.origin)

        .then(function (sendlink) {
            if (sendlink) {

                res.send(sendlink);
            } else {
                // authentication failed
                res.status(400).send('email');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function resetpassword(req, res) {
    
    forgotpasswordService.resetpassword(req.body)

        .then(function (resetpassword) {
            if (resetpassword) {

                res.send(resetpassword);
            } else {
                // authentication failed
                res.status(400).send('Password Reset');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
