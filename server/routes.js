var express = require('express');
var router = express.Router();



var profiledata = require('./controllers/profile/profile.controller');

router.get('/profile/getprofileInfo/:userId', profiledata.getprofileInfo);
router.post('/profile/updateprofile', profiledata.updateprofile);

var passworddata = require('./controllers/password/password.controller');
router.post('/password/passwordmatch', passworddata.passwordmatch);


var productsdata = require('./controllers/products/products.controller');

router.post('/products/addproduct', productsdata.addproduct);
router.get('/products/getAllproducts', productsdata.getAllproducts);

router.delete('/products/deleteproduct/:productid', productsdata.deleteproduct);
router.get('/products/getallproductbyId/:productid', productsdata.getallproductbyId);


module.exports = router;