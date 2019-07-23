var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var products = require('../controllers/products/products.model');// get our mongoose model

var service = {};

service.addproduct = addproduct;
service.getAllproducts = getAllproducts;
service.deleteproduct = deleteproduct;
service.getallproductbyId = getallproductbyId;
service.updateprodcutdetail = updateprodcutdetail;

function addproduct(addproducts) {
    var deferred = Q.defer();

    var ProductsData = [];
    for (let i = 0; i < addproducts.length; i++) {
        ProductsData.push({ image: addproducts[i].image, productname: addproducts[i].productname, 'costprice': addproducts[i].costprice, 'markup': addproducts[i].Markup, 'sellingprice': addproducts[i].sellingprice, 'tilltype': addproducts[i].tilltype, 'stocklevel': addproducts[i].stocklevel, 'date': addproducts[i].date })
    }

    products.insertMany(ProductsData, function (err, product) {
        if (!err) {

            deferred.resolve(product);
        } else {

            console.log(err);
            deferred.reject(err.name + ': ' + err.message);
        }
    });

    return deferred.promise;

}


function getAllproducts() {

    var deferred = Q.defer();
    var userId = new mongoose.Types.ObjectId(userId);

    products.find(function (err, getallproducts) {
        if (!err) {
            deferred.resolve(getallproducts);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });
    return deferred.promise;

}

function deleteproduct(productid) {

    var deferred = Q.defer();
    var id = new mongoose.Types.ObjectId(productid);
    products.deleteOne(
        { _id: new mongoose.Types.ObjectId(id) },
        function (err) {
            if (err) {
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                var data = {};
                data.string = 'Product deleted successfully.';
                deferred.resolve(data);
            }

        });
    return deferred.promise;
}


function getallproductbyId(productid) {

    var deferred = Q.defer();
    var id = new mongoose.Types.ObjectId(productid);

    products.findOne({ _id: id }, function (err, getproducts) {
        if (!err) {
            deferred.resolve(getproducts);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });
    return deferred.promise;
}



function updateprodcutdetail(data) {
    var deferred = Q.defer();

    var id = new mongoose.Types.ObjectId(data.id);
    products.findOneAndUpdate({ _id: id }, {
        image: data.image,
        productname: data.productname,
        costprice: data.costprice,
        sellingprice: data.sellingprice,
        date: data.date,
        tilltype: data.tilltype,
        stocklevel: data.stocklevel,
        markup: data.markup

    }, function (err, updateproducts) {

        if (!err) {
            deferred.resolve(updateproducts);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}
module.exports = service;


