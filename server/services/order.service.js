var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var dateFormat = require('dateformat');

var mongoose = require('mongoose');
var orders = require('../controllers/order/order.model');
var products = require('../controllers/products/products.model');
var cartdetails = require('../controllers/products/cartdetails.model');

var service = {};
service.getAllorders = getAllorders;
service.getAllproductorderdetails = getAllproductorderdetails;
service.verifyorder = verifyorder;
service.createorder = createorder;
service.payment = payment;
service.checkorderhistory = checkorderhistory;
service.getqrcodedetails = getqrcodedetails;
service.getProductsbydate = getProductsbydate;
service.getProductsbyid = getProductsbyid;
service.getnumberofcustomerpurchases = getnumberofcustomerpurchases;
service.getproductratingcounts = getproductratingcounts;
service.getvalueofcustomerpurchases = getvalueofcustomerpurchases;

function getAllorders(merchantId, userType) {

  var deferred = Q.defer();
  var merchantIddata = new mongoose.Types.ObjectId(merchantId);
  if (userType == 'admin') {

    orders.aggregate([
      {
        $lookup: {
          from: "appusers",
          localField: "userId",
          foreignField: "_id",
          as: "appuserdata"
        }
      }]).exec(function (err, getdata) {

        if (!err) {
          deferred.resolve(getdata);
        } else {
          deferred.reject(err.name + ': ' + err.message);
        }
      });

  } else {

    orders.aggregate([
      {
        '$match': {
          merchantId: merchantIddata
        }
      },
      {
        $lookup: {
          from: "appusers",
          localField: "userId",
          foreignField: "_id",
          as: "appuserdata"
        }
      }]).exec(function (err, getdata) {

        if (!err) {
          deferred.resolve(getdata);
        } else {
          deferred.reject(err.name + ': ' + err.message);
        }
      });

  }

  return deferred.promise;
}



function getAllproductorderdetails(appuserId) {
  var deferred = Q.defer();
  var appuserId = new mongoose.Types.ObjectId(appuserId);

  orders.findOne(appuserId, function (err, data) {
    if (!err) {
      deferred.resolve(data);
    } else {
      deferred.reject(err.name + ': ' + err.message);
    }
  });
  return deferred.promise;

}


function verifyorder(orderDetails) {

  var deferred = Q.defer();
  var merchantId = orderDetails.merchantId;
  var stockdata = [];
  var productdetails = [];
  for (let i = 0; i < orderDetails.productdetails.length; i++) {

    var merchantId = merchantId;
    var productId = orderDetails.productdetails[i].productId;
    products.aggregate([

      {
        '$match': {
          merchantid: merchantId,
          _id: new mongoose.Types.ObjectId(productId)
        }
      },
      {
        "$project": {
          "_id": 1,
          "stocklevel": 1
        }
      },

      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "productdetails.productId",
          as: "ordersdetails"
        }
      },
      { '$unwind': { 'path': '$ordersdetails', 'preserveNullAndEmptyArrays': true } },
      { '$unwind': { 'path': '$ordersdetails.productdetails', 'preserveNullAndEmptyArrays': true } },
      {
        '$project': {
          '_id': 1,
          "stocklevel": 1,
          'ordersdetails': {
            $cond: { if: { $eq: ["$ordersdetails.productdetails.productId", new mongoose.Types.ObjectId(productId)] }, then: "$ordersdetails.productdetails", else: [] }
          }

        }
      },
      {
        '$group': {
          '_id': null,
          'stocklevel': { '$first': '$stocklevel' },
          'totalQty': {
            '$sum': '$ordersdetails.quantity'
          }
        }
      },
    ]).exec(function (err, getorderdetails) {
      if (!err) {

        if (getorderdetails == '') {

          var orders = {
            "status": "0",
            "message": "no data found",
            "data":
              {}
          }
          deferred.resolve(orders);
        } else {

          var stocklevel = getorderdetails[0].stocklevel;
          var quantity = getorderdetails[0].totalQty;
          var stock = stocklevel - quantity;

          console.log('sttcok leves');
          console.log(stocklevel);
          console.log(orderDetails.productdetails[i].qty);
          if (stock >= orderDetails.productdetails[i].qty) {
            stockdata.push('true')
          } else {
            stockdata.push('false')

          }
          if (orderDetails.productdetails.length == stockdata.length) {

            var n = stockdata.includes("false");
           
            console.log('n');
            console.log(n);
            if (n == true) {


              var orders = {
                "status": "0",
                "message": "Order Not Verified",
                "data":
                  {}
              }

              deferred.resolve(orders);
            } else {
              var orders =
              {
                "status": "1",
                "message": "Order Verified",
                "data": {

                }
              }
              deferred.resolve(orders);
            }
          }
        }
      } else {

        var orders = {
          "status": "0",
          "message": "no data found",
          "data":
            {}
        }
        deferred.resolve(orders);
      }
    })

  }
  return deferred.promise;
}


function createorder(details) {
  var deferred = Q.defer();
  var productdata = [];
  for (let i = 0; i < details.productdetails.length; i++) {

    productdata.push({ "tillTypeId": details.productdetails[i].tillTypeId, "productId": details.productdetails[i].productId, "productName": details.productdetails[i].productName, "sellingPrice": parseInt(details.productdetails[i].sellingPrice), "quantity": parseInt(details.productdetails[i].qty) })

    var userId = details.userId;
    var productId = details.productdetails[i].productId
    var deferred = Q.defer();
    cartdetails.updateOne({ userId: userId },

      { $pull: { productdetails: { productId: productId } } },
      { multi: true },
      function (err, cartresults) {
        if (!err) {
          if (cartresults.nModified == 0) {

            // console.log('sucess');

          } else {
            // console.log('scuess');
          }
        }
        else {
          // console.log('err');
        }
      });

  }

  var saveData = new orders({
    userId: new mongoose.Types.ObjectId(details.userId),
    status: "pending",
    merchantId: new mongoose.Types.ObjectId(details.merchantId),
    totalAmount: parseInt(details.totalAmount),
    productdetails: productdata
  });

  saveData.save(function (err, orderdata) {
    if (!err) {

      var orderDetails =
      {
        "status": "1",
        "message": "Successful",
        "data": {
          orderId: orderdata._id
        }
      }

      deferred.resolve(orderDetails);

    } else {

      var orders = {
        "status": "0",
        "message": "no data found",
        "data":
          {}
      }
      deferred.resolve(orders);
    }
  });
  return deferred.promise;
}


function payment(paymentdetails) {
  var deferred = Q.defer();

  var status;
  if (paymentdetails.is_Completed == 1) {

    status = "Completed"

  } else {
    status = "pending"
  }

  orders.findOneAndUpdate({ _id: paymentdetails.orderId }, {
    status: status,
    transaction_Id: paymentdetails.transaction_Id,
    message: paymentdetails.message,
  }, function (err, payments) {

    if (err) {

      var paymentdetails = {
        "status": "0",
        "message": "no data found",
        "data":
          {}
      }

      deferred.resolve(paymentdetails);

    } else {

      var payment =
      {
        "status": "1",
        "message": "Successful",
        "data": {

        }
      }

      deferred.resolve(payment);
    }

  })
  return deferred.promise;
}


function checkorderhistory(user) {
  var deferred = Q.defer();


  orders.aggregate([
    {
      '$match': {
        "userId": new mongoose.Types.ObjectId(user.userId), "merchantId": new mongoose.Types.ObjectId(user.merchantId)
      }
    },
  {
    $unwind: "$productdetails"
  },
   {
        $lookup: {
          from: "products",
         localField: "productdetails.productId",
          foreignField: "_id",
          as: "ordersdetails"
        }
    },
    {
        '$unwind' : '$ordersdetails'
        },
    {
        '$project' : {
             "_id" : 1,
             "userId" : 1,
             "status" : 1,
             "merchantId" : 1,
             "productdetails" : 1,
             "totalAmount" : 1,
             "dateadded" : 1,
             "datemodified" : 1,
             "ordersdetails" : '$ordersdetails',
             "__v" : 1
            }
        },{
            '$group' : {
                 '_id' : '$_id',
                 'mainDetails' : {
                         '$first' : {
                             "_id" : "$_id",
                             "userId" : "$userId",
                             "status" : "$status",
                             "totalAmount" : "$totalAmount",
                             "merchantId" : "$merchantId",
                             "dateadded" : "$dateadded",
                             "datemodified" : "$datemodified"
                             }
                     },
                 'details' : {
                         '$push' : {
                         "_id" : '$productdetails._id',
                         "tillTypeId" : '$productdetails.tillTypeId',
                         "productId" : '$productdetails.productId',
                         "productName" : '$productdetails.productName',
                         "sellingPrice" : '$productdetails.sellingPrice',
                         "quantity" : '$productdetails.quantity',
                         "dateadded" : '$productdetails.dateadded',
                         "datemodified" : '$productdetails.datemodified',
                         "image" : "$ordersdetails.image"
                     }
                     }
                }
            },{
                '$project' : {
                     "_id" : "$_id",
                     "userId" : "$mainDetails.userId",
                     "status" : "$mainDetails.status",
                     "totalAmount" : "$mainDetails.totalAmount",
                     "merchantId" : "$mainDetails.merchantId",
                     "dateadded" : "$mainDetails.dateadded",
                     "datemodified" : "$mainDetails.datemodified",
                    'details' : '$details'
                    }
                }
  ]).exec(function (err, getorderdetails) {
    if (!err) {

      if (getorderdetails == '' || getorderdetails == null || getorderdetails == "null") {
      
        var orderdetailsnodata = {
          "status": "0",
          "message": "no data found",
          "data":
            {}
        } 
        deferred.resolve(orderdetailsnodata);

      } else {

      
        var orderDetails = []
        getorderdetails.forEach(element => {
         
          var order = {}
          order.orderId = element._id
          order.status = element.status
          var totalAmount = element.totalAmount == undefined ? '' : element.totalAmount
          order.totalAmount = totalAmount.toString();
          var productdetails = []
          element.details.forEach(items => {

            var product = {}
            product.productId = items._id == undefined ? '' : items._id
            product.productName = items.productName == undefined ? '' : items.productName
            var sellingPrice = items.sellingPrice.toString() == undefined ? '' : items.sellingPrice.toString()
            product.sellingPrice = sellingPrice
            var quantity = items.quantity.toString() == undefined ? '' : items.quantity.toString()
            product.quantity = quantity;
            product.image = items.image == undefined ? '' : items.image;
            productdetails.push(product);

          });
          order.date = element.dateadded == undefined ? '' : element.dateadded;
          order.productdetails = productdetails;
          orderDetails.push(order);
        });

            var ordercreate =
              {
                "status": "1",
                "message": "Successful",

                orderDetails

              }
              deferred.resolve(ordercreate);

      }

      deferred.resolve(orderDetails);
    } else {

      var orderdetailsnodata = {
        "status": "0",
        "message": "no data found",
        "data":
          {}
      } 
      deferred.resolve(orderdetailsnodata);
    }
  })
   return deferred.promise;
}


function getqrcodedetails(product) {
  var deferred = Q.defer();
  var id = new mongoose.Types.ObjectId(product.productId);

  products.findOne({ _id: id, merchantid: product.merchantId }, function (err, getproducts) {
    if (!err) {

      if (getproducts == null || getproducts == 'null') {
        var productdetails = {
          "status": "0",
          "message": "Unable to fetch product from your merchant.",
          "data":
            {}
        }

        deferred.resolve(productdetails);

      } else {

        var costPrice = getproducts.costprice.toString() == undefined ? '' : getproducts.costprice.toString();
        var sellingPrice = getproducts.sellingprice.toString() == undefined ? '' : getproducts.sellingprice.toString();
        var stockLevel = getproducts.stocklevel.toString() == undefined ? '' : getproducts.stocklevel.toString();
        var product =
        {
          "status": "1",
          "message": "Successful",
          "data": {
            image: getproducts.image == undefined ? '' : getproducts.image,
            productName: getproducts.productname == undefined ? '' : getproducts.productname,
            markup: getproducts.markup == undefined ? '' : getproducts._id,
            costPrice: costPrice == undefined ? '' : costPrice,
            sellingPrice: sellingPrice == undefined ? '' : sellingPrice,
            tillType: getproducts.tilltype == undefined ? '' : getproducts.tilltype,
            stockLevel: stockLevel == undefined ? '' : stockLevel,
            merchantId: getproducts.merchantid == undefined ? '' : getproducts.merchantid

          }
        }
        deferred.resolve(product);
      }

    } else {

      var productdetails = {
        "status": "0",
        "message": "no data found",
        "data":
          {}
      }

      deferred.resolve(productdetails);
    }
  })
  return deferred.promise;

}


function getProductsbydate(productdetails) {

  var deferred = Q.defer();
  var startdate = new Date(productdetails.startdate)
  var enddate = new Date(productdetails.endDate)
  startdate.setDate(startdate.getDate() + 1)
  enddate.setDate(enddate.getDate() + 1)
  orders.aggregate([
    {
      '$match': {
        "productdetails.productId": new mongoose.Types.ObjectId(productdetails.productname)
      }
    },
    { $unwind: "$productdetails" },
    {
      '$match': {
        "productdetails.productId": new mongoose.Types.ObjectId(productdetails.productname)
      }
    },
    {
      '$match': {
        "dateadded": { $gte: new Date(startdate), $lt: new Date(enddate) }
      }
    },
    {
      '$group': {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateadded" } },

        'Qty': {
          '$sum': '$productdetails.quantity'
        }
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


function getProductsbyid(details) {

  var deferred = Q.defer();
  products.find({
    'tillTypeId': new mongoose.Types.ObjectId(details.productid),
  }, function (err, results) {
    if (!err) {

      deferred.resolve(results);

    } else {

      deferred.reject(err.name + ': ' + err.message);

    }
  })
  return deferred.promise;
}

function getnumberofcustomerpurchases(productdetails) {


  var deferred = Q.defer();
  var startdate = new Date(productdetails.startdate);
  var enddate = new Date(productdetails.endDate);
  startdate.setDate(startdate.getDate() + 1);
  enddate.setDate(enddate.getDate() + 1);

  orders.aggregate([
    {
      '$match': {
        "merchantId": new mongoose.Types.ObjectId(productdetails.merchantid)
      }
    },
    {
      '$match': {
        "dateadded": { $gte: new Date(startdate), $lt: new Date(enddate) }
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


function getproductratingcounts(productdetails) {


  var deferred = Q.defer();
  var startdate = new Date(productdetails.startdate);
  var enddate = new Date(productdetails.endDate);
  startdate.setDate(startdate.getDate() + 1);
  enddate.setDate(enddate.getDate() + 1);
  orders.aggregate([
    {
      '$match': {
        "merchantId": new mongoose.Types.ObjectId(productdetails.merchantid)
      }
    },
    {
      '$match': {
        "dateadded": { $gte: new Date(startdate), $lt: new Date(enddate) }
      }
    },

  ]).exec(function (err, getorderdetails) {
    if (!err) {

      var category = []
      getorderdetails.forEach(element => {
        var cat = {}
        var day = dateFormat(new Date(element.dateadded), "mmm dd");
        cat.label = day

        category.push(cat);
      });

      var dataarray = [];
      getorderdetails.forEach(element => {
        var test = {}
        var data = []
        var i = 0;
        var day = dateFormat(new Date(element.dateadded), "mmm dd");

        element.productdetails.forEach(items => {
          var product = {}
          product.value = items.quantity.toString()
          data.push(product);
          i++;
        });

        test.data = data
        dataarray.push(test);

      });

      test = [];
      for (let index = 0; index < dataarray.length; index++) {

        const element = dataarray[index].data;
        test.push(dataarray[index].data.length)
      }

      var largestvalue = Math.max.apply(Math, test);

      dataSet = [];
      for (let a = 0; a < largestvalue; a++) {

        var scoandarray = [];
        for (let index = 0; index < dataarray.length; index++) {

          if (dataarray[index].data[a] == undefined || dataarray[index].data[a] == "undefined") {
            dataarray[index].data[a] = 0;
          }

          scoandarray.push(dataarray[index].data[a])
        }
        var value = {}
        value.data = scoandarray;
        dataSet.push(value);
      }

      var product =
      {
        "status": "1",
        "message": "Successful",
        "data": {
          category,
          dataSet,
        }
      }
      deferred.resolve(product);
    } else {
      deferred.reject(err.name + ': ' + err.message);
    }
  })
  return deferred.promise;
}

function getvalueofcustomerpurchases(customerdetails) {


  var deferred = Q.defer();
  var startdate = new Date(customerdetails.startdate);
  var enddate = new Date(customerdetails.endDate);
  startdate.setDate(startdate.getDate() + 1);
  enddate.setDate(enddate.getDate() + 1);
  var deferred = Q.defer();
  orders.aggregate([
    {
      '$match': {
        "merchantId": new mongoose.Types.ObjectId(customerdetails.merchantid), "userId": new mongoose.Types.ObjectId(customerdetails.username)
      }
    },

    {
      '$match': {
        "dateadded": { $gte: new Date(startdate), $lt: new Date(enddate) }
      }
    },
    { '$sort': { 'dateadded': 1 } },
    { $unwind: "$productdetails" },
    {
      "$group": {
        _id:
        { dayOfYear: "$dateadded"},
      
        'totalQty': {
          '$sum': { '$abs': { '$toInt': "$productdetails.quantity" } }
        },
        'value': {
          '$sum': { '$abs': { '$toInt': "$productdetails.sellingPrice" } }
        },
      }
      
    },
   { '$sort': { '_id.dayOfYear': 1 } },

  ]).exec(function (err, getorderdetails) {
    if (!err) {


      deferred.resolve(getorderdetails);
    } else {

      deferred.reject(err.name + ': ' + err.message);
    }
  })
  return deferred.promise;
}
module.exports = service;

