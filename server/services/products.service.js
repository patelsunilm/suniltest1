var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var mongoose = require('mongoose');
var products = require('../controllers/products/products.model');// get our mongoose model
var Productcategories = require('../controllers/products/productcategories.model');
var cartdetails = require('../controllers/products/cartdetails.model');


var appuser = require('../controllers/Users/appusers.model');


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
service.addtocart = addtocart;
service.RemoveCart = RemoveCart;
service.getCategoriesProducts = getCategoriesProducts;


function addproduct(addproducts) {


    var deferred = Q.defer();
    var ProductsData = [];
    for (let i = 0; i < addproducts.length; i++) {
        var id = new mongoose.Types.ObjectId(addproducts[i].userId);
        var productcatid = new mongoose.Types.ObjectId(addproducts[i].productcategories);

        ProductsData.push({ image: addproducts[i].image, productname: addproducts[i].productname, 'costprice': addproducts[i].costprice, 'markup': addproducts[i].Markup, 'sellingprice': addproducts[i].sellingprice, 'tilltype': addproducts[i].tilltype, 'stocklevel': addproducts[i].stocklevel, 'date': addproducts[i].date, 'barcode': addproducts[i].barcode, 'merchantid': addproducts[i].merchantId, 'productcatid': productcatid })
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


function getAllproducts(details) {


    var startLimit = parseInt(details.startLimit)
    var endLimit = parseInt(details.endLimit)

    var deferred = Q.defer();
    products.find({ merchantid: details.merchantId }, function (err, getallproducts) {
        if (!err) {

            if (getallproducts == '' || getallproducts == null || getallproducts == 'null') {
                var productresponcedata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(productresponcedata);
            } else {
                var allproduct = [];
                getallproducts.forEach(element => {

                    var product = {}
                    product.productId = element._id == undefined ? '' : element._id;
                    product.image = element.image == undefined ? '' : element.image;
                    product.productName = element.productname == undefined ? '' : element.productname;
                    product.markup = element.markup == undefined ? '' : element._id;
                    product.costPrice = element.costprice == undefined ? '' : element.costprice;
                    product.sellingPrice = element.sellingprice == undefined ? '' : element.sellingprice;
                    product.tillType = element.tilltype == undefined ? '' : element.tilltype;
                    product.stockLevel = element.stocklevel == undefined ? '' : element.stocklevel;
                    product.barcode = element.barcode == undefined ? '' : element.barcode;
                    product.merchantId = element.merchantid == undefined ? '' : element.merchantid;

                    allproduct.push(product);

                });

                products.find({ merchantid: details.merchantId }, function (err, getallproducts) {
                    if (!err) {

                        var productresponcedata = {
                            "status": "1",
                            "message": "Success",
                            "data": {
                                allproduct,
                                "totalCounts": getallproducts.length
                            }

                        }
                        deferred.resolve(productresponcedata);
                    }
                })
            }

        } else {
            var productresponcedata = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }
            deferred.resolve(productresponcedata);
        }
    }).skip(startLimit).limit(endLimit)
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


    products.findOne({ barcode: id.barcode }, function (err, getproducts) {

        if (!err) {


            if (getproducts) {

                var productresponcedata =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        "productId": getproducts._id,
                        "image": getproducts.image,
                        "productName": getproducts.productname,
                        "costPrice": getproducts.costprice,
                        "markup": getproducts.markup,
                        "sellingPrice": getproducts.sellingprice,
                        "tillType": getproducts.tilltype,
                        "stockLevel": getproducts.stocklevel,
                        "merchantId": getproducts.merchantid

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


function getAllProductcategories(details) {
    var deferred = Q.defer();


    Productcategories.find({ merchantId: details.merchantId }, function (err, getproductscategories) {
        if (!err) {
            if (getproductscategories == '') {


                var productresponcedata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }

            } else {
                var allproductctegory = [];
                getproductscategories.forEach(element => {

                    var productcat = {}
                    productcat.productCatId = element._id == undefined ? '' : element._id;
                    productcat.catName = element.catName == undefined ? '' : element.catName;


                    allproductctegory.push(productcat);

                });

                var productresponcedata = {
                    "status": "1",
                    "message": "Success",
                    "data":
                        allproductctegory
                }

            }

            deferred.resolve(productresponcedata);


        } else {
            deferred.reject(err.name + ': ' + err.message);


        }
    }).sort({ dateadded: -1 });
    return deferred.promise;

}


function getproducts(merchantId) {


    var deferred = Q.defer();

    products.find({ merchantid: merchantId }, function (err, getproductscategories) {
        if (!err) {
            deferred.resolve(getproductscategories);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });
    return deferred.promise;
}

function addproductcategories(catname, merchantId) {

    var deferred = Q.defer();
    var id = new mongoose.Types.ObjectId(merchantId);
    Productcategories.find({ $and: [{ catName: catname }, { merchantId: id }] }, function (err, getcategory) {
        if (getcategory.length > 0) {
            var data = {};
            data.string = 'Product Category is already exist.';
            deferred.resolve(data);
        } else {

            var procat = new Productcategories({
                catName: catname,
                merchantId: id
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



function addtocart(cart) {

    var count = cart.count
    var productresponcedata = {
        "status": "0",
        "message": "no data found",
        "data":
            {}
    }
    var deferred = Q.defer();
    appuser.findOne({ _id: cart.userId }, function (err, User) {
        if (!err) {

            products.findOne({ _id: cart.productId }, function (err, getproductsdetails) {
                if (!err) {

                    var id = new mongoose.Types.ObjectId(cart.userId);
                    cartdetails.findOne({
                        userId: id

                    }, function (err, cart) {
                        if (!err) {

                            if (cart == '' || cart == null || cart == 'null') {

                                var cart = new cartdetails({
                                    userId: User._id,
                                    status: "pending",
                                    productdetails: [{
                                        productId: getproductsdetails._id,
                                        quantity: count,
                                        image: getproductsdetails.image,
                                        productName: getproductsdetails.productname,
                                        costPrice: getproductsdetails.costprice,
                                        markUp: getproductsdetails.markup,
                                        sellingPrice: getproductsdetails.sellingprice,
                                        merchantId: getproductsdetails.merchantid,
                                        barcode: getproductsdetails.barcode
                                    }
                                    ]
                                });

                                cart.save(function (err, cartdetails) {
                                    if (!err) {
                                        var cartsucessresponce = {
                                            "status": "1",
                                            "message": "Success",
                                            "data":
                                                {}
                                        }
                                        deferred.resolve(cartsucessresponce);
                                    } else {

                                        deferred.resolve(productresponcedata);

                                    }

                                });
                            } else {
                                var id = new mongoose.Types.ObjectId(getproductsdetails._id);
                                var cartid = new mongoose.Types.ObjectId(cart._id);
                                cartdetails.findOne(

                                    { "_id": cartid },
                                    { productdetails: { $elemMatch: { productId: id } } }
                                    , function (err, carts) {
                                        if (carts.productdetails == null || carts.productdetails == 'null' || carts.productdetails == '') {

                                            var productData = [];
                                            var i;
                                            productData.push({ 'productId': getproductsdetails._id, 'image': getproductsdetails.image, 'productName': getproductsdetails.productname, 'costPrice': getproductsdetails.costprice, 'markUp': getproductsdetails.markup, 'sellingPrice': getproductsdetails.sellingprice, 'merchantId': getproductsdetails.merchantid, 'barcode': getproductsdetails.barcode, 'quantity': count })
                                            cartdetails.findOneAndUpdate({
                                                userId: User._id
                                            },
                                                {
                                                    $push: {
                                                        productdetails: productData
                                                    },
                                                }, function (err, responce) {
                                                    if (err) {

                                                        deferred.resolve(productresponcedata);

                                                    } else {

                                                        var cartsucessresponce = {
                                                            "status": "1",
                                                            "message": "Success",
                                                            "data":
                                                                {}
                                                        }
                                                        deferred.resolve(cartsucessresponce);
                                                    }
                                                })

                                        } else {

                                            var carid = new mongoose.Types.ObjectId(carts._id)
                                            var procatid = new mongoose.Types.ObjectId(carts.productdetails[0]._id);

                                            var quantity = count.toString();
                                            cartdetails.updateOne(
                                                { _id: carid, "productdetails._id": procatid },
                                                { $set: { "productdetails.$.quantity": quantity } }
                                                , function (err, cartdetailsupdates) {

                                                    if (err) {

                                                        deferred.resolve(cartresponcedata);

                                                    } else {
                                                        var cartsucessresponce = {
                                                            "status": "1",
                                                            "message": "Success",
                                                            "data":
                                                                {}
                                                        }
                                                        deferred.resolve(cartsucessresponce);
                                                    }

                                                });
                                        }
                                    })

                            }
                        } else {

                            deferred.resolve(productresponcedata);
                        }
                    })
                } else {

                    deferred.resolve(productresponcedata);
                }
            })

        } else {
            deferred.resolve(productresponcedata);
        }
    })
    return deferred.promise;
}

function RemoveCart(cart) {

    var cartresponcedata = {
        "status": "0",
        "message": "no data found",
        "data":
            {}
    }
    var deferred = Q.defer();
    cartdetails.updateOne({ userId: cart.userId },

        { $pull: { productdetails: { productId: cart.productId } } },
        { multi: true },
        function (err, cartresults) {
            if (!err) {
                if (cartresults.nModified == 0) {

                    deferred.resolve(cartresponcedata);

                } else {
                    var cartsucessresponce = {
                        "status": "1",
                        "message": "Success",
                        "data":
                            {}
                    }

                    cartdetails.find({ userId: cart.userId }, function (err, products) {
                        if (!err) {
                            if (products[0].productdetails.length == 0) {

                                cartdetails.deleteOne(
                                    { userId: cart.userId },
                                    function (err) {
                                        if (err) {

                                            deferred.reject(err.name + ': ' + err.message);
                                        }
                                        else {

                                            deferred.resolve();
                                        }
                                    });

                            }
                        } else {
                            deferred.reject(err.name + ': ' + err.message);
                        }
                    });

                    deferred.resolve(cartsucessresponce);
                }
            }
            else {
                deferred.resolve(cartresponcedata);
            }
        });

    return deferred.promise;
}

function getCategoriesProducts(product) {

    var startLimit = parseInt(product.startLimit)
    var endLimit = parseInt(product.endLimit)
    var deferred = Q.defer();
    products.find({ productcatid: product.productCatId }, function (err, getproducts) {
        if (!err) {

            if (getproducts == '' || getproducts == null || getproducts == 'null') {
                var productresponcedata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(productresponcedata);
            } else {
                var allproduct = [];

                getproducts.forEach(element => {
                    var catproduct = {}
                    catproduct.productId = element._id == undefined ? '' : element._id;
                    catproduct.image = element.image == undefined ? '' : element.image;
                    catproduct.productName = element.productname == undefined ? '' : element.productname;
                    catproduct.markup = element.markup == undefined ? '' : element._id;
                    catproduct.costPrice = element.costprice == undefined ? '' : element.costprice;
                    catproduct.sellingPrice = element.sellingprice == undefined ? '' : element.sellingprice;
                    catproduct.tillType = element.tilltype == undefined ? '' : element.tilltype;
                    catproduct.stockLevel = element.stocklevel == undefined ? '' : element.stocklevel;
                    catproduct.barcode = element.barcode == undefined ? '' : element.barcode;
                    catproduct.merchantId = element.merchantid == undefined ? '' : element.merchantid;
                    allproduct.push(catproduct);

                });

                products.find({ productcatid: product.productCatId }, function (err, getproducts) {
                    if (!err) {

                        var productresponcedata = {
                            "status": "1",
                            "message": "Success",
                            "data": {
                                allproduct,
                                "totalCounts": getproducts.length
                            }

                        }
                        deferred.resolve(productresponcedata);
                    }
                })
            }
        } else {

            var productresponcedata = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }

            deferred.resolve(productresponcedata);
        }
    }).skip(startLimit).limit(endLimit)
    return deferred.promise;

}

module.exports = service;


