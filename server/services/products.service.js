var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var qr = require('qr-image');

var Q = require('q');
const bwipjs = require('bwip-js');
var Barc = require('barcode-generator')
    , barc = new Barc()
    , fs = require('fs');
var dateFormat = require('dateformat');

var mongoose = require('mongoose');
var products = require('../controllers/products/products.model');// get our mongoose model
var Productcategories = require('../controllers/products/productcategories.model');
var cartdetails = require('../controllers/products/cartdetails.model');
var appuser = require('../controllers/Users/appusers.model');

var tilldetails = require('../controllers/tillmanagement/tilldetails.model');
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
service.getproductdetailsbyid = getproductdetailsbyid;
service.addproductrating = addproductrating;
service.getproductrating = getproductrating;
service.updateproductrating = updateproductrating;
service.getproductratingbyid = getproductratingbyid;
service.getProductsRatingDetails = getProductsRatingDetails;
service.getProductsRatingDetailsbyid = getProductsRatingDetailsbyid;
service.gettilldetails = gettilldetails;


function addproduct(addproducts) {

    var deferred = Q.defer();
    a = 0;
    let updatepro = 0;
    for (let i = 0; i < addproducts.length; i++) {

        var id = new mongoose.Types.ObjectId(addproducts[i].userId);
        var productcatid = new mongoose.Types.ObjectId(addproducts[i].productcategories);
        var saveallproducts = new products({
            tillTypeName: addproducts[i].tilltypename,
            image: addproducts[i].image,
            productname: addproducts[i].productname,
            costprice: addproducts[i].costprice,
            markup: addproducts[i].Markup,
            sellingprice: addproducts[i].sellingprice,
            tilltype: addproducts[i].tilltype,
            stocklevel: addproducts[i].stocklevel,
            date: addproducts[i].date,
            barcode: addproducts[i].barcode,
            merchantid: addproducts[i].merchantId,
            productcatid: productcatid,
            tillTypeId: addproducts[i].tilltypeid
        });

        saveallproducts.save(function (err, productsresults) {
            if (!err) {

                var qr_svg = qr.image(addproducts[i].url + '/#/product/' + productsresults._id, { type: 'png', parse_url: true });
                var datetime = new Date(new Date).valueOf();
                var randomnumber = Math.floor((Math.random() * 100) + 1);
                var filename = qr_svg.pipe(require('fs').createWriteStream('qrcodeimage/' + datetime + randomnumber + 'qr.png')).path
                var sep = filename.split("/");
                var id = new mongoose.Types.ObjectId(productsresults._id);

                products.findOneAndUpdate({ _id: id }, {
                    qrcodeImage: sep[1],

                }, function (err, updateproducts) {
                    if (!err) {
                        updatepro++
                        if (addproducts.length == updatepro) {

                            deferred.resolve(updateproducts);
                        } else {
                            deferred.reject(err.name + ': ' + err.message);
                        }

                    } else {

                        deferred.reject(err.name + ': ' + err.message);
                    }
                })

            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        })

    }

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


function getallproductbyId(productid , merchantId) {
   
    console.log('pro ids');
    console.log(productid);
    console.log(merchantId);

    // var merchantids = "5d80860b1570a00a782852c2";
    var deferred = Q.defer();
    var id = new mongoose.Types.ObjectId(productid);

    products.findOne({ $or:[{ _id: id },{merchantid :  merchantids} ]}, function (err, getproducts) {
        if (!err) {
            
            console.log('get all products');
            console.log(getproducts);
            deferred.resolve(getproducts);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ dateadded: -1 });
    return deferred.promise;

}



function updateprodcutdetail(data) {
    var deferred = Q.defer();

    if (data.to == '' || data.to == null || data.to == undefined) {
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
            tillTypeId: data.tillTypeId,
            tillTypeName: data.tilltypename,
            productcatid: new mongoose.Types.ObjectId(data.catname),

        }, function (err, updateproducts) {

            if (!err) {

                deferred.resolve(updateproducts);
            } else {

                deferred.reject(err.name + ': ' + err.message);
            }
        })
    } else {

        var tillMovementdata = [];
        tillMovementdata.push({ "from": data.form, "to": data.to, "fromStock": data.fromstock, "moveStock": data.movestock, "fromId": data.fromId, "toId": data.toId })


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
            tillTypeId: data.tillTypeId,
            tillTypeName: data.tilltypename,
            productcatid: new mongoose.Types.ObjectId(data.catname),
            // tillMovement:tillMovementdata
            $push: {
                tillMovement: tillMovementdata
            }
        }, function (err, updateproducts) {

            if (!err) {

                deferred.resolve(updateproducts);
            } else {

                deferred.reject(err.name + ': ' + err.message);
            }
        })


    }
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

                    var count = parseInt(cart.count);
                    var quantity = getproductsdetails.stocklevel == null ? 0 : getproductsdetails.stocklevel;

                    if (quantity >= count) {

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
                                            barcode: getproductsdetails.barcode,

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
    var deferred = Q.defer();
    var cartresponcedata = {
        "status": "0",
        "message": "no data found",
        "data":
            {}
    }

    if (parseInt(cart.count) == 0) {

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

    } else {

        cartdetails.update({
            userId: new mongoose.Types.ObjectId(cart.userId),
            "productdetails.productId": new mongoose.Types.ObjectId(cart.productId)
        }, { "$set": { "productdetails.$.quantity": cart.count } }, function (err, results) {
            if (!err) {
                var cartsucessresponce = {
                    "status": "1",
                    "message": "Success",
                    "data":
                        {}
                }
                deferred.resolve(cartsucessresponce);

            } else {

                var productresponcedata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(productresponcedata);
            }
        })
    }

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
                    catproduct.markup = element.markup == undefined ? '' : element.markup;
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


function getproductdetailsbyid(data) {

    var deferred = Q.defer();
    products.findOne({ _id: data.productId }, function (err, responce) {
        if (!err) {
            if (responce == '' || responce == null || responce == 'null') {
                var productresponcedata = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(productresponcedata);
            } else {

                var markups = responce.markup.toString();
                var sellingPrice = responce.sellingprice.toString();
                var stockLevel = responce.stocklevel.toString();
                var costprice = responce.costprice.toString();

                var productdata =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        "productId": responce._id == undefined ? '' : responce._id,
                        "image": responce.image == undefined ? '' : responce.image,
                        "productName": responce.productname == undefined ? '' : responce.productname,
                        "markup": markups == undefined ? '' : markups,
                        "sellingPrice": sellingPrice == undefined ? '' : sellingPrice,
                        "merchantId": responce.merchantid == undefined ? '' : responce.merchantid,
                        "stockLevel": stockLevel == undefined ? '' : stockLevel,
                        "costprice": costprice = undefined ? '' : costprice
                    }
                }
                deferred.resolve(productdata);
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
    })
    return deferred.promise;

}



function addproductrating(ratingDetails) {
    var deferred = Q.defer();
    var ratingdata = [];
    ratingdata.push({ 'rating': parseInt(ratingDetails.rating), 'comment': ratingDetails.comment, 'userId': ratingDetails.userId })

    products.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(ratingDetails.productId)
    },
        {
            $push: {
                ratings: ratingdata
            },
        }, function (err, reatingresults) {
            if (err) {

                var ratingResponceData = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }
                deferred.resolve(ratingResponceData);

            } else {

                var ratingdata =
                {
                    "status": "1",
                    "message": "Product review has been added.",
                    "data": {}
                }
                deferred.resolve(ratingdata);
            }
        })
    return deferred.promise;
}



function getproductrating(getproduct) {
    var deferred = Q.defer();
    products.aggregate([
        {
            '$match': {
                "_id": new mongoose.Types.ObjectId(getproduct.productId)
            }
        },
        { $unwind: "$ratings" },

        {
            '$match': {
                "ratings.userId": new mongoose.Types.ObjectId(getproduct.userId)
            }
        },
        {
            $lookup: {
                from: "appusers",
                localField: "ratings.userId",
                foreignField: "_id",
                as: "username"
            }

        },
    ]).exec(function (err, getratingdata) {
        if (!err) {

            if (getratingdata == '' || getratingdata == 'undefined' || getratingdata == undefined || getratingdata == null) {
                var ratingResponceData = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }

                deferred.resolve(ratingResponceData);
            } else {

                var productrating = []
                getratingdata.forEach(element => {
                    var objrating = {}
                    ratingId = element.ratings._id == undefined ? '' : element.ratings._id,
                        objrating.ratingId = ratingId.toString();
                    rating = element.ratings.rating == undefined ? '' : element.ratings.rating;
                    objrating.rating = rating.toString();
                    objrating.comment = element.ratings.comment == undefined ? '' : element.ratings.comment;
                    objrating.userId = element.ratings.userId == undefined ? '' : element.ratings.userId;
                    objrating.userName = element.username[0].firstname == undefined ? '' : element.username[0].firstname;
                    productrating.push(objrating)

                });
                var ratingdata =
                {
                    "status": "1",
                    "message": "Successful",
                    "data": {
                        productrating
                    }
                }
                deferred.resolve(ratingdata);
            }

        } else {

            var ratingResponceData = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }

            deferred.resolve(ratingResponceData);
        }
    });
    return deferred.promise;
}


function updateproductrating(ratingDetails) {

    var deferred = Q.defer();

    products.update({
        _id: new mongoose.Types.ObjectId(ratingDetails.productId), "ratings._id": new mongoose.Types.ObjectId(ratingDetails.ratingId)
    }, { "$set": { "ratings.$.comment": ratingDetails.comment, "ratings.$.rating": ratingDetails.rating } }, function (err, results) {
        if (!err) {

            var ratingdata =
            {
                "status": "1",
                "message": "Successful",
                "data": {}
            }

            deferred.resolve(ratingdata);

        } else {

            var ratingResponceData = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }
            deferred.resolve(ratingResponceData);
        }
    })
    return deferred.promise;
}




function getproductratingbyid(ratingDetails) {

    var startLimit = parseInt(ratingDetails.startLimit)
    var endLimit = parseInt(ratingDetails.endLimit)


    var deferred = Q.defer();
    products.aggregate([
        {
            '$match': {
                "_id": new mongoose.Types.ObjectId(ratingDetails.productId)
            }
        },
        { $unwind: "$ratings" },
        {
            $lookup: {
                from: "appusers",
                localField: "ratings.userId",
                foreignField: "_id",
                as: "username"
            }
        },
        { '$sort': { 'ratings': -1 } },
        { $skip: startLimit },
        { $limit: endLimit },
    ]).exec(function (err, getratingdata) {
        if (!err) {

            if (getratingdata == '' || getratingdata == 'undefined' || getratingdata == undefined || getratingdata == null) {
                var ratingResponceData = {
                    "status": "0",
                    "message": "no data found",
                    "data":
                        {}
                }

                deferred.resolve(ratingResponceData);
            } else {

                products.findOne({ _id: new mongoose.Types.ObjectId(ratingDetails.productId) }, function (err, prodata) {
                    if (!err) {

                        var productrating = []
                        getratingdata.forEach(element => {
                            var objrating = {}
                            ratingId = element.ratings._id == undefined ? '' : element.ratings._id,
                            objrating.ratingId = ratingId.toString();
                            rating = element.ratings.rating == undefined ? '' : element.ratings.rating;
                            objrating.rating = rating.toString();
                            objrating.comment = element.ratings.comment == undefined ? '' : element.ratings.comment;
                            objrating.userId = element.ratings.userId == undefined ? '' : element.ratings.userId;
                          
                            
                            objrating.userName = (element.username[0] == undefined ||element.username[0].firstname == undefined || element.username[0].firstname == "undefined" || element.username[0].firstname == '' || element.username[0].firstname == null) ? '' : element.username[0].firstname;
                            productrating.push(objrating)

                        });
                        var ratingdata =
                        {
                            "status": "1",
                            "message": "Successful",
                            "data": {
                                productrating,
                                "totalCounts": prodata.ratings.length
                            },

                        }
                        deferred.resolve(ratingdata);
                    } else {
                        var ratingResponceData = {
                            "status": "0",
                            "message": "no data found",
                            "data":
                                {}
                        }
                        deferred.resolve(ratingResponceData);
                    }
                });
            }

        } else {

            var ratingResponceData = {
                "status": "0",
                "message": "no data found",
                "data":
                    {}
            }
            deferred.resolve(ratingResponceData);
        }
    });
    return deferred.promise;
}

function getProductsRatingDetails(merchant) {

    var deferred = Q.defer();
    products.aggregate([
        {
            '$match': {
                merchantid: merchant.merchantId,

            }
        },

        {
            "$unwind": "$ratings"
        },
        {
            "$group": {
                "_id": "$_id",
                'productname': { '$first': '$productname' },
                'details': {
                    '$push': {
                        "_id": '$ratings._id',
                        "rating": '$ratings.rating',
                        "comment": '$ratings.comment',
                        "userId": '$ratings.userId'
                    }
                },
                "qty": { "$sum": "$ratings.rating" },

            }
        },
        { '$sort': { 'qty': 1 } }

    ]).exec(function (err, getorderdetails) {
        if (!err) {
            deferred.resolve(getorderdetails);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}

function getProductsRatingDetailsbyid(productdetails) {
    var deferred = Q.defer();
    products.aggregate([
        {
            '$match': {
                _id: new mongoose.Types.ObjectId(productdetails.productid)

            }
        },

        {
            "$unwind": "$ratings"
        },
        {
            $lookup: {
                from: "appusers",
                localField: "ratings.userId",
                foreignField: "_id",
                as: "username"
            }
        },
    ]).exec(function (err, getorderdetails) {
        if (!err) {
            deferred.resolve(getorderdetails);
        } else {

            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;
}


function gettilldetails(deatils) {
  
    var deferred = Q.defer();
    var startdate = new Date(deatils.startdate);
    var enddate = new Date(deatils.endDate);
    startdate.setDate(startdate.getDate() + 1);
    enddate.setDate(enddate.getDate() + 1);
    productid = deatils.productname;

    var deferred = Q.defer();
    products.aggregate([
        {
            '$match': {
                _id: new mongoose.Types.ObjectId(deatils.productname)
               }
        },
        { $unwind: "$tillMovement" },
        {
            '$match': {
              "tillMovement.dateadded": { $gte: new Date(startdate), $lt: new Date(enddate) }
            }
          },
        {
            "$group": {
                _id:
                {
                    year: { $year: "$tillMovement.dateadded" },
                    month: { $month: "$tillMovement.dateadded" },
                    day: { $dayOfMonth: "$tillMovement.dateadded" },
                    //  dayOfYear: "$tillMovement.dateadded" ,
                },
                'totalQty': {
                    '$sum': { '$abs': { '$toInt': "$tillMovement.moveStock" } }
                }
            }
        }
    ]).exec(function (err, tillresults) {
        if (!err) {
           



            deferred.resolve(tillresults);
        } else {
            
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}
module.exports = service;


