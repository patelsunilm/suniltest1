var express = require('express');
var router = express.Router();
var userService = require('../../services/users.service');

router.post('/authenticate', authenticate);
router.post('/addsignupuser', addsignupuser);
router.post('/addsecretValuedata', addsecretValuedata)
router.post('/updateipaddress', updateipaddress)
router.post('/submitgoogledetails', submitgoogledetails);
router.post('/submitfacebookdetails', submitfacebookdetails);

router.post('/loginwithemail', loginwithemail);
router.post('/matchotp', matchotp);
router.get('/getmerchantcategories', getmerchantcategories);
router.post('/selectMerchant', selectMerchant);

router.post('/getlastfivemerchant' , getlastfivemerchant);
router.post('/loginwithmoblenumber' , loginwithmoblenumber);

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

function updateipaddress(req, res) {

    userService.updateipaddress(req.body)
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


function submitgoogledetails(req, res) {
    userService.submitgoogledetails(req.body)
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


function loginwithemail(req, res) {

    userService.loginwithemail(req.body)
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

function selectMerchant(req, res) {

    userService.selectMerchant(req.body)
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
function matchotp(req, res) {

    userService.matchotp(req.body)

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

function getmerchantcategories(req, res) {

    userService.getmerchantcategories(req.body)

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


function submitfacebookdetails(req, res) {

    userService.submitfacebookdetails(req.body)
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


function getlastfivemerchant(req, res) {
 
    userService.getlastfivemerchant(req.body)
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


function loginwithmoblenumber(req, res) {
  
    userService.loginwithmoblenumber(req.body)
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



exports.GetallUsersDetails = function (req, res) {

    userService.GetallUsersDetails()
        .then(function (getusersdata) {
            if (getusersdata) {

                res.send(getusersdata);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}