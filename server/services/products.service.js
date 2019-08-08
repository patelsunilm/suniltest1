var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var products = require('../controllers/products/products.model');// get our mongoose model
var Productcategories = require('../controllers/products/productcategories.model'); 
var service = {};

service.addproduct = addproduct;
service.getAllproducts = getAllproducts;
service.deleteproduct = deleteproduct;
service.getallproductbyId = getallproductbyId;
service.updateprodcutdetail = updateprodcutdetail;
service.getbarcodedetail = getbarcodedetail;
service.getAllProductcategories = getAllProductcategories;
service.getproducts = getproducts;
service.addproductcategories = addproductcategories;



function addproduct(addproducts) {
   
   
    var deferred = Q.defer();
    var ProductsData = [];
    for (let i = 0; i < addproducts.length; i++) {
        var id = new mongoose.Types.ObjectId(addproducts[i].userId);
        var productcatid = new mongoose.Types.ObjectId(addproducts[i].productcategories);

        ProductsData.push({ image: addproducts[i].image, productname: addproducts[i].productname, 'costprice': addproducts[i].costprice, 'markup': addproducts[i].Markup, 'sellingprice': addproducts[i].sellingprice, 'tilltype': addproducts[i].tilltype, 'stocklevel': addproducts[i].stocklevel, 'date': addproducts[i].date, 'barcode': addproducts[i].barcode, 'merchantid': addproducts[i].merchantId, 'productcatid':productcatid })
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


function getAllproducts(merchantId) {
        

    var startPage = 2;
    var pageLimit =  4;
    
    var deferred = Q.defer();
    products.find({ merchantid: merchantId }, function (err, getallproducts) {
        if (!err) {
            if (getallproducts) {

                var allproduct = [];
                getallproducts.forEach(element => {

                    var product = {}
                    product.productid = element._id;
                    product.image = element.image;
                    product.productname = element.productname;
                    product.markup = element.markup;
                    product.costprice = element.costprice;
                    product.sellingprice = element.sellingprice;
                    product.tilltype = element.tilltype;
                    product.stocklevel = element.stocklevel;
                    product.barcode = element.barcode;
                    product.data = element.data;
                    product.merchantid = element.merchantid;
                    allproduct.push(product);
                    
                });

                var productresponcedata = {
                    "status": "1",
                    "message": "Success",
                    "data":
                    allproduct
                }
            } else {
                var productresponcedata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
            }

            deferred.resolve(productresponcedata);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    }).skip(startPage).limit(pageLimit)
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
        markup: data.markup,
    }, function (err, updateproducts) {

        if (!err) {
            deferred.resolve(updateproducts);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}


function getbarcodedetail(id) {

    var deferred = Q.defer();
   
    
    products.findOne({ barcode:id.barcode }, function (err, getproducts) {

        if (!err) {
            
           
            if (getproducts) {
              
                var productresponcedata =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        "productid" :getproducts._id,
                        "image": getproducts.image,
                        "productname": getproducts.productname,
                        "costprice": getproducts.costprice,
                        "markup": getproducts.markup,
                        "sellingprice": getproducts.sellingprice,
                        "tilltype": getproducts.tilltype,
                        "stocklevel": getproducts.stocklevel,
                         "merchantid" : getproducts.merchantid
                         
                    }
                }
            } else {
                var productresponcedata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
            }

            deferred.resolve(productresponcedata);

        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}


function getAllProductcategories() {
    var deferred = Q.defer();
   
    Productcategories.find(function (err, getproductscategories) {
        if (!err) {
            deferred.resolve(getproductscategories);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });
    return deferred.promise;

}


function getproducts(merchantId) {


var deferred = Q.defer();
   
products.find({merchantid : merchantId},function (err, getproductscategories) {
    if (!err) {
        deferred.resolve(getproductscategories);
    } else {
        deferred.reject(err.name + ': ' + err.message);
    }
}).sort({ dateadded: -1 });
return deferred.promise;
}

function addproductcategories(catname) {

    var deferred = Q.defer();
    Productcategories.find({catName : catname}, function(err, getcategory){
        if (getcategory.length > 0) {
            var data = {};
            data.string = 'Product Category is already exist.';
            deferred.resolve(data);
        } else {
          var procat = new Productcategories({
             catName : catname

        });
        procat.save(function (err, productcategory) {
            if (!err) {
                deferred.resolve(productcategory);
            } else {
               
                deferred.reject(err.name + ': ' + err.message);
            }
        });

        }
    })

    return deferred.promise;
    
}



module.exports = service;


