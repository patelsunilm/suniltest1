require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('./config.json');
var mongoose = require('mongoose');
var session = require('express-session');
var fs = require('fs');
const multer = require('multer');
var AWS = require('aws-sdk');
var sharp = require('sharp');
var Q = require('q');
var qr = require('qr-image');

var Q = require('q');
const bwipjs = require('bwip-js');
var Barc = require('barcode-generator')
    , barc = new Barc()
    , fs = require('fs');
var dateFormat = require('dateformat');



uploads = require("express-fileupload")
var path = require('path');

const csv = require('csv-parser')
var products = require('../server/controllers/products/products.model');// get our mongoose model

var appuser = require('../server/controllers/Users/appusers.model');
var productcategory = require('../server/controllers/products/productcategories.model');
var tilldetails = require('../server/controllers/tillmanagement/tilldetails.model');

gm = require('gm');


var mongodbUrl = 'mongodb://' + config.DB_User + ':' + encodeURIComponent(config.DB_Pass) + '@' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME;
//var mongodbUrl = 'mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME;



// Database options
// Option auto_reconnect is defaulted to true
var dbOptions = {
  server: {
    reconnectTries: -1, // always attempt to reconnect
    socketOptions: {
      keepAlive: 120
    }
  }
};

// Events on db connection
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error. Please make sure MongoDB is running. -> ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.error('MongoDB connection disconnected.')
});

mongoose.connection.on('reconnected', function () {
  console.error('MongoDB connection reconnected.')
});

// Connect to db
var connectWithRetry = function () {
  return mongoose.connect(mongodbUrl, dbOptions, function (err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec. -> ' + err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};


connectWithRetry();
var http = require('https');
// var https = require('https');
// var options = {
//   key: fs.readFileSync('./ssl/privkey.pem'),
//   cert: fs.readFileSync('./ssl/fullchain.pem')
// };
var app = express();
//app.use(forceSsl);
//var server = https.createServer(options,app).listen(3000);
var server = http.createServer(app);
//var io = ios.listen(server);
var routes = require('./routes');
//app.set('socketio', io);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(session({ secret: 'secret', resave: 'false', saveUninitialized: 'false' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// Enable CORS

app.use(cors());
app.use(function (req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Bootstrap routes


// Static files
app.use('/', express.static(__dirname + '/../public'));


// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
  secret: config.secret,
  getToken: function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
         
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({
  path: ['/users/authenticate',
    '/users/addsecretValuedata',
    '/users/updateipaddress',
    '/users/addsignupuser',
    '/users/submitgoogledetails',
    '/users/submitfacebookdetails',
    '/users/getmerchantcategories',
    '/forgot-password-2/sendlink',
    '/forgot-password-2/resetpassword', '/products/addcsvfile',
    '/users/loginwithemail',
    '/users/matchotp',
    '/users/selectMerchant',
    '/users/getlastfivemerchant',
    '/users/loginwithmoblenumber' 
    
  ]
}));



// routes
app.use(routes);
app.use('/users', require('./controllers/Users/users.controller'));



app.use('/forgot-password-2', require('./controllers/forgot-password-2/forgot-password-2.controller'));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Token');
  } else {
    throw err;
  }

});

//aws credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAJRCOCZM7YVPHCJRA";
AWS.config.secretAccessKey = "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";
AWS.config.region = "us-east-1";
AWS.config.apiVersions = {
  "s3": "2012-10-17"
}


var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {

    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }

});

var upload = multer({ storage: storage });

app.post('/addcsvfile', upload.any('uploads[]'), function (req, res) {


  var merchantId = req.body.uploads
  tilldetails.findOne({ merchantId: merchantId }, function (err, results) {
    if (!err) {
   
      if (results == '' || results == null || results == 'null') {
        var data = {};
        data.string = 'Pls add Primary till type';
        res.send(data);
     
      } else {

        var tilltype = "Primary"
        var tilltypeId = results._id;
        var tilltypename = results.name
        var file = req.files[0];
        var userid = req.body.uploads
        var originalFileName = file.originalname;
        var results = [];
        var strem = fs.createReadStream('uploads/' + originalFileName, { headers: true })
          .pipe(csv())
          .on('data', (data) =>
            results.push(data))
          .on('end', () => {

            var arr1 = ['productname', 'productcategory',
              'costprice',
              'markup',
              'date',
              'tilltype',
              'stocklevel'];


            var arr2 = results[0].headers;
        
            if (arr1.length == arr2.length && arr1.every(function (u, i) {
              return u === arr2[i];
            })) {
              var allproducts = [];
              var j = 0;
              for (let i = 0; i < results.length; i++) {
                var cost = results[i].costprice == '' ? 0 : results[i].costprice;
                var markup = results[i].markup == '' ? 0 : results[i].markup;
                var sellingprice = (parseInt(cost) + parseInt(markup))
                results[i].sellingprice = sellingprice;

                var datetime = new Date(new Date).valueOf();
                var randomnumber = Math.floor((Math.random() * 100) + 1);
                results[i].barcode = datetime + randomnumber;
                results[i].merchantid = userid;

                var deferred = Q.defer();
                productcategory.findOne({ $and: [{ catName: results[i].productcategory }, { merchantId: results[i].merchantid }] }, function (err, getcategory) {
                  if (getcategory) {

                    results[i].productcatid = getcategory._id;

                  } else {

                    var procat = new productcategory({
                      catName: results[i].productcategory,
                      merchantId: results[i].merchantid

                    });
                    procat.save(function (err, productcategory) {
                      if (!err) {

                        if (productcategory._id) {

                          results[i].productcatid = productcategory._id;
                          var allproducts = new products({
                            productname: results[i].productname,
                            productcatid: results[i].productcatid,
                            costprice: results[i].costprice,
                            markup: results[i].markup,
                            sellingprice: results[i].sellingprice,
                            date: results[i].date,
                            tilltype: results[i].tilltype,
                            stocklevel: results[i].stocklevel,
                            barcode: results[i].barcode,
                            merchantid: results[i].merchantid,
                            tillTypeId: tilltypeId,
                            tilltype: tilltype,
                            tillTypeName : tilltypename
                          });

                          allproducts.save(function (err, product) {
                            if (!err) {

                              var qr_svg = qr.image(results[i].url + '/#/product/' + product._id, { type: 'png', parse_url: true });
                              var datetime = new Date(new Date).valueOf();
                              var randomnumber = Math.floor((Math.random() * 100) + 1);
                              var filename = qr_svg.pipe(require('fs').createWriteStream('qrcodeimage/' + datetime + randomnumber + 'qr.png')).path
                              var sep = filename.split("/");
                              var id = new mongoose.Types.ObjectId(product._id);
              
                              products.findOneAndUpdate({ _id: id }, {
                                  qrcodeImage: sep[1],
              
                              }, function (err, updateproducts) {
                                  if (!err) {
                                      // updatepro++
                                      // if (addproducts.length == updatepro) {
              
                                      //     deferred.resolve(updateproducts);
                                      // } else {
                                      //     deferred.reject(err.name + ': ' + err.message);
                                      // }
                              if ((i + 1) == results.length) {

                                fs.unlink('uploads/' + originalFileName, function (err, responce) {
                                  if (err) {

                                    deferred.reject(err.name + ': ' + err.message);
                                  } else {


                                    var data = {};
                                    data.string = 'Csv import success fully';
                                    res.send(data);
                                  }
                                })
                              }
                                      
                                  } else {
              
                                      deferred.reject(err.name + ': ' + err.message);
                                  }
                              })


                              // if ((i + 1) == results.length) {

                              //   fs.unlink('uploads/' + originalFileName, function (err, responce) {
                              //     if (err) {

                              //       deferred.reject(err.name + ': ' + err.message);
                              //     } else {


                              //       var data = {};
                              //       data.string = 'Csv import success fully';
                              //       res.send(data);
                              //     }
                              //   })
                              // }

                            } else {
                              deferred.reject(err.name + ': ' + err.message);
                            }

                          });
                        }

                      } else {

                      }
                    });
                  }

                  if (results[i].productcatid) {


                    var allproducts = new products({
                      productname: results[i].productname,
                      productcatid: results[i].productcatid,
                      costprice: results[i].costprice,
                      markup: results[i].markup,
                      sellingprice: results[i].sellingprice,
                      date: results[i].date,
                      tilltype: results[i].tilltype,
                      stocklevel: results[i].stocklevel,
                      barcode: results[i].barcode,
                      merchantid: results[i].merchantid,
                      tillTypeId: tilltypeId,
                      tilltype: tilltype,
                      tillTypeName : tilltypename
                    });

                    allproducts.save(function (err, product) {
                      if (!err) {


                        var qr_svg = qr.image(results[i].url + '/#/product/' + product._id, { type: 'png', parse_url: true });
                        var datetime = new Date(new Date).valueOf();
                        var randomnumber = Math.floor((Math.random() * 100) + 1);
                        var filename = qr_svg.pipe(require('fs').createWriteStream('qrcodeimage/' + datetime + randomnumber + 'qr.png')).path
                        var sep = filename.split("/");
                        var id = new mongoose.Types.ObjectId(product._id);
        
                        products.findOneAndUpdate({ _id: id }, {
                            qrcodeImage: sep[1],
        
                        }, function (err, updateproducts) {
                            if (!err) {
                                // updatepro++
                                // if (addproducts.length == updatepro) {
        
                                //     deferred.resolve(updateproducts);
                                // } else {
                                //     deferred.reject(err.name + ': ' + err.message);
                                // }
                        if ((i + 1) == results.length) {

                          fs.unlink('uploads/' + originalFileName, function (err, responce) {
                            if (err) {

                              deferred.reject(err.name + ': ' + err.message);
                            } else {
                              var data = {};
                              data.string = 'Csv import success fully';
                              res.send(data);
                            }
                          })
                        }
                            } else {
        
                                deferred.reject(err.name + ': ' + err.message);
                            }
                        })

                        // if ((i + 1) == results.length) {

                        //   fs.unlink('uploads/' + originalFileName, function (err, responce) {
                        //     if (err) {

                        //       deferred.reject(err.name + ': ' + err.message);
                        //     } else {
                        //       var data = {};
                        //       data.string = 'Csv import success fully';
                        //       res.send(data);
                        //     }
                        //   })
                        // }
                      } else {
                        deferred.reject(err.name + ': ' + err.message);
                      }
                    });
                  }
                })
              }

            } else {

              fs.unlink('uploads/' + originalFileName, function (err, responce) {
                if (err) {

                 
                } else {

                  var data = {};
                  data.string = 'error';
                  res.send(data);
                }
              })
            }
          });
      }

    } else {
      deferred.reject(err.name + ': ' + err.message);
    }
  })


})



app.post('/uploadproductfiles', upload.any('uploads[]'), function (req, res) {

  var s3data = [];

  var uploadedfiles = req.files;
  var datetime = new Date(new Date).valueOf();
  var randomnumber = Math.floor((Math.random() * 100) + 1);

  for (let i = 0; i < uploadedfiles.length; i++) {
    var s3 = new AWS.S3();

    var sizeOf = require('image-size');
    var dimensions = sizeOf(uploadedfiles[i].path);

    var logowidth = 100;
    var logoheight = 100;
    sharp(uploadedfiles[i].path).jpeg({ compressionLevel: 9, adaptiveFiltering: true, force: true })
      // .flatten(true)
      // .background('white')
      // .embed()
      .resize(dimensions.width, dimensions.height).toBuffer(function (err, data) {
        var datetime = new Date(new Date).valueOf();
        var randomnumber = Math.floor((Math.random() * 100) + 1);
        var seperate = uploadedfiles[i].originalname;
        var sep = seperate.split(".");

        var params = {
          'Bucket': 'smaf',
          'Key': 'smaf/uploads/' + datetime + randomnumber + '.' + sep[1],
          'Body': data,
          'ContentEncoding': 'base64',
          ACL: 'public-read',
          Metadata: {
            'Content-Type': 'image/' + sep[1]
          }
        };

        s3.upload(params, function (err, resultdata) {
          if (err) {
           
          }
          else {

            //s3data.push(resultdata.Location)
            s3data.push({ 's3url': resultdata.Location, 'index': i });

            if (s3data.length == uploadedfiles.length) {
              res.send(s3data);
            }
          }
        })
      })
  }
})


app.post('/updateuserprofile', upload.any('uploads[]'), function (req, res) {
  var s3data = [];

 
  if (req.files == '') {


  
    appuser.findById(req.body.userId, function (err, getdata) {
      if (!err) {
        getdata.email = req.body.email
        getdata.firstname = req.body.firstName;
        getdata.lastname = req.body.lastName;
        getdata.phone = req.body.phone;
      
        getdata.save(function (err, usersResults) {
          if (!err) {

            var user = [];
            var userprofile = {
              "status": "1",
              "message": "Your Profile has been updated successfully.",
              "data":
              {
                email: usersResults.email == undefined ? '' : usersResults.email,
                firstName: (usersResults.firstname == undefined || usersResults.firstname == null || usersResults.firstname == "null") ? '' : usersResults.firstname,
                lastName: (usersResults.lastname == undefined || usersResults.firstname == null || usersResults.firstname == "null") ? '' : usersResults.lastname,
                image: usersResults.image == undefined ? '' : usersResults.image,
                phone: usersResults.phone == undefined ? '' : usersResults.phone,
                userId: usersResults._id == undefined ? '' : usersResults._id,
                lastMerchantId: usersResults.lastMerchantId == undefined ? '' : usersResults.lastMerchantId,

              }
            }
            res.send(userprofile);
          } else {
            var userprofile = {
              "status": "0",
              "message": "Unable to update profile.",
              "data":
                {}
            }
            res.send(userprofile);
          }
        });
      } else {
        var userprofile = {
          "status": "0",
          "message": "Unable to update profile.",
          "data":
            {}
        }
        res.send(userprofile);
      }
    });
  } else {

    var uploadedfiles = req.files;
    var s3 = new AWS.S3();
    var sizeOf = require('image-size');
    var dimensions = sizeOf(uploadedfiles[0].path);
    var logowidth = 100;
    var logoheight = 100;
    sharp(uploadedfiles[0].path).jpeg({ compressionLevel: 9, adaptiveFiltering: true, force: true })
      // .flatten(true)
      // .background('#F6F8FA')
      // .embed()
      .resize(logowidth, logoheight).toBuffer(function (err, data) {
        var datetime = new Date(new Date).valueOf();
        var randomnumber = Math.floor((Math.random() * 100) + 1);
        var seperate = uploadedfiles[0].originalname;
        var sep = seperate.split(".");

        var params = {
          'Bucket': 'smaf',
          'Key': 'smaf/users/' + datetime + randomnumber + '.' + sep[1],
          'Body': data,
          'ContentEncoding': 'base64',
          ACL: 'public-read',
          Metadata: {
            'Content-Type': 'image/' + sep[1]
          }
        };

        s3.upload(params, function (err, resultdata) {
          if (err) {
           
          }
          else {

            appuser.findById(req.body.userId, function (err, getdata) {

              if (!err) {
                getdata.email = req.body.email
                getdata.firstname = req.body.firstName;
                getdata.lastname = req.body.lastName;
                getdata.phone = req.body.phone;
                getdata.image = resultdata.Location;
                getdata.save(function (err, usersResults) {
                  if (!err) {

                    var user = [];

                    var userprofile = {
                      "status": "1",
                      "message": "Your Profile has been updated successfully.",
                      "data":
                      {

                        email: usersResults.email == undefined ? '' : usersResults.email,
                        firstName: (usersResults.firstname == undefined || usersResults.firstname == null || usersResults.firstname == "null") ? '' : usersResults.firstname,
                        lastName: (usersResults.lastname == undefined || usersResults.firstname == null || usersResults.firstname == "null") ? '' : usersResults.lastname,
                        image: usersResults.image == undefined ? '' : usersResults.image,
                        phone: usersResults.phone == undefined ? '' : usersResults.phone,
                        userId: usersResults._id == undefined ? '' : usersResults._id,
                        lastMerchantId: usersResults.lastMerchantId == undefined ? '' : usersResults.lastMerchantId,

                      }
                    }

                    res.send(userprofile);

                  } else {

                    var userprofile = {
                      "status": "0",
                      "message": "Unable to update profile.",
                      "data":
                        {}
                    }
                    res.send(userprofile);
                  }
                });

              } else {

                var userprofile = {
                  "status": "0",
                  "message": "Unable to update profile.",
                  "data":
                    {}
                }
                res.send(userprofile);
              }
            });
          }
        })
      })
  }
})


// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
// Once database open, start server
mongoose.connection.once('open', function callback() {
  console.log('Connection with database succeeded.');

  var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
  });
});






// var allproducts = new products({
//   productname: (results[i].productname == undefined || results[i].productname == 'undefined' || results[i].productname == null || results[i].productname == 'null') ? '' : results[i].productname,
//   productcatid:(results[i].productcatid == undefined ||results[i].productcatid == 'undefined' ||results[i].productcatid == null || results[i].productcatid == 'null') ? '' :  results[i].productcatid,
//   costprice: (results[i].costprice == undefined ||results[i].costprice == 'undefined' ||results[i].costprice == null || results[i].costprice == 'null') ? '' :results[i].costprice,
//   markup: (results[i].markup == undefined ||results[i].markup == 'undefined' ||results[i].markup == null || results[i].markup == 'null') ? '' :results[i].markup,
//   sellingprice:(results[i].sellingprice == undefined ||results[i].sellingprice == 'undefined' ||results[i].sellingprice == null || results[i].sellingprice == 'null') ? '' :results[i].sellingprice,
//   date:(results[i].date == undefined ||results[i].date == 'undefined' ||results[i].date == null || results[i].date == 'null') ? '' : results[i].date,
//   tilltype:(results[i].tilltype == undefined ||results[i].tilltype == 'undefined' ||results[i].tilltype == null || results[i].tilltype == 'null') ? '' : results[i].tilltype,
//   stocklevel:(results[i].stocklevel == undefined ||results[i].stocklevel == 'undefined' ||results[i].stocklevel == null ||results[i].stocklevel == 'null') ? '' : results[i].stocklevel,
//   barcode:(results[i].barcode == undefined ||results[i].barcode == 'undefined' ||results[i].barcode == null || results[i].barcode == 'null') ? '' :results[i].barcode,
//   merchantid:(results[i].merchantid == undefined ||results[i].merchantid == 'undefined' ||results[i].merchantid == null || results[i].merchantid == 'null') ? '' : results[i].merchantid,

// });