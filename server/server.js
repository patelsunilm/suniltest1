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
uploads = require("express-fileupload")
var path = require('path');
const csv = require('csv-parser')
var products = require('../server/controllers/products/products.model');// get our mongoose model

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
    '/forgot-password-2/sendlink',
    '/forgot-password-2/resetpassword', '/products/addcsvfile'


  ]
}));



// routes
app.use(routes);
app.use('/users', require('./controllers/Users/users.controller'));

app.use('/forgot-password-2', require('./controllers/forgot-password-2/forgot-password-2.controller'));

app.use(function (err, req, res, next) {
  console.log(err);
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

  var file = req.files[0];
  var userid = req.body.uploads

  var originalFileName = file.originalname;

  const results = [];


  var strem = fs.createReadStream('uploads/' + originalFileName, { headers: true })
    .pipe(csv())
    .on('data', (data) =>
      results.push(data))
    .on('end', () => {

      var arr1 = ['productname',
        'costprice',
        'markup',
        'sellingprice',
        'date',
        'tilltype',
        'stocklevel'];
      var arr2 = results[0].headers;

      if (arr1.length == arr2.length
        && arr1.every(function (u, i) {
          return u === arr2[i];
        })
      ) {

        for (let i = 0; i < results.length; i++) {
          var datetime = new Date(new Date).valueOf();
          var randomnumber = Math.floor((Math.random() * 100) + 1);

          results[i].barcode = datetime + randomnumber
          results[i].userid = userid
        }

        products.insertMany(results, function (err, product) {
          if (!err) {

            fs.unlink('uploads/' + originalFileName, function (err, responce) {
              if (err) {

                console.log(err);
              } else {


                var data = {};
                data.string = 'Csv import success fully';
                res.send(data);
              }
            })
          } else {
            console.log(err);
          }
        });
      } else {

        fs.unlink('uploads/' + originalFileName, function (err, responce) {
          if (err) {

            console.log(err);
          } else {


            var data = {};
            data.string = 'error';
            res.send(data);
          }
        })
      }
    });
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
      // .background('#F6F8FA')
      // .embed()
      .resize(logowidth, logoheight).toBuffer(function (err, data) {
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
            console.log(err);
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


// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
// Once database open, start server
mongoose.connection.once('open', function callback() {
  console.log('Connection with database succeeded.');

  var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
  });
});
