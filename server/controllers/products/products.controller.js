var express = require('express');
var router = express.Router();

var productservice = require('./../../services/products.service')



exports.addproduct = function(req, res) {

    productservice.addproduct(req.body)
    .then(function (addproductdata) {

        if (addproductdata) {

            res.send(addproductdata);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });


}

exports.getAllproducts = function(req, res) {
    productservice.getAllproducts()
    .then(function (getproductdata) {

        if (getproductdata) {

            res.send(getproductdata);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}


exports.deleteproduct = function(req, res) {
    
    
    productservice.deleteproduct(req.params.productid)
    .then(function (data) {
           
        res.json(data);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.getallproductbyId = function(req, res) {

    productservice.getallproductbyId(req.params.productid)
    .then(function (getproduct) {
        if (getproduct) {
            res.send(getproduct);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.updateprodcutdetail = function(req, res) {
 
    productservice.updateprodcutdetail(req.body)
    .then(function (getproduct) {
        if (getproduct) {
            res.send(getproduct);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
