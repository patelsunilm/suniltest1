var express = require('express');
var router = express.Router();
var merchentService = require('../../services/merchant.service');

exports.getallMerchentsData = function (req, res) {

    merchentService.getallMerchentsData()
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

exports.getmerchantDatabyId = function (req, res) {

    merchentService.getmerchantDatabyId(req.params.merchantDataId)
        .then(function (databyID) {
            if (databyID) {
                res.send(databyID);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

exports.updatemerchantData = function (req, res) {

    merchentService.updatemerchantData(req.body)
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

exports.merchantStatusToggle = function (req, res) {

    merchentService.merchantStatusToggle(req.body)
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


exports.deletemerchantData = function (req, res) {

    merchentService.deletemerchantData(req.params.merchantDataId, req.params.userId, req.params.name)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}


exports.getMerchentsbyId = function (req, res) {

    merchentService.getMerchentsbyId(req.params.catid)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}


exports.getMerchantCategories = function (req, res) {

    merchentService.getMerchantCategories()
        .then(function (getcategorydata) {
            if (getcategorydata) {
                res.send(getcategorydata);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });


}


exports.SearchMerchant = function (req, res) {

    merchentService.SearchMerchant(req.body)
        .then(function (SearchMerchantdetails) {
            if (SearchMerchantdetails) {
                res.send(SearchMerchantdetails);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}


exports.getMerchantCategoriebyId = function(req, res) {

    merchentService.getMerchantCategoriebyId(req.body)
       .then(function (getmerchantcategorys) {
        if (getmerchantcategorys) {
            res.send(getmerchantcategorys);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.addmerchantreview = function(req, res) {
  
    merchentService.addmerchantreview(req.body)
       .then(function (merchantreview) {
        if (merchantreview) {
            res.send(merchantreview);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}


exports.getmerchantreview = function(req, res) {
  
    merchentService.getmerchantreview(req.body)
      
    .then(function (getmerchantreview) {
        if (getmerchantreview) {
            res.send(getmerchantreview);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}


exports.updatemerchantreview = function(req, res) {
    
    merchentService.updatemerchantreview(req.body) 
    .then(function (updatemerchantreview) {
        if (updatemerchantreview) {
            res.send(updatemerchantreview);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}


exports.getallproductratings = function(req, res) {
    
    merchentService.getallproductratings(req.body) 
    .then(function (allproductratings) {
        if (allproductratings) {
            res.send(allproductratings);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}


exports.getchatallMerchentsData = function(req, res) {
    
    merchentService.getchatallMerchentsData() 
    .then(function (allproductratings) {
        if (allproductratings) {
            res.send(allproductratings);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}