var express = require('express');
var router = express.Router();
var orderService = require('../../services/order.service');



exports.getAllorders = function (req, res) {

  orderService.getAllorders(req.params.merchantId, req.params.userType)
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

exports.getAllproductorderdetails = function (req, res) {

  orderService.getAllproductorderdetails(req.params.appuserId)
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


exports.verifyorder = function (req, res) {

  orderService.verifyorder(req.body)
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

exports.createorder = function (req, res) {

  orderService.createorder(req.body)
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



exports.payment = function (req, res) {

  orderService.payment(req.body)
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



exports.checkorderhistory = function (req, res) {

  orderService.checkorderhistory(req.body)
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



exports.getqrcodedetails = function (req, res) {

  orderService.getqrcodedetails(req.body)
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


exports.getProductsbydate = function (req, res) {

  orderService.getProductsbydate(req.body)
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

exports.getProductsbyid = function (req, res) {
  orderService.getProductsbyid(req.body)
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


exports.getnumberofcustomerpurchases = function (req, res) {

  orderService.getnumberofcustomerpurchases(req.body)
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


exports.getproductratingcounts = function (req, res) {

  orderService.getproductratingcounts(req.body)
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

exports.getvalueofcustomerpurchases = function (req, res) {

  orderService.getvalueofcustomerpurchases(req.body)
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