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
router.post('/products/updateprodcutdetail', productsdata.updateprodcutdetail);


var merchentdata = require('./controllers/merchant/merchant.controller');
router.get('/merchant/getallMerchentsData', merchentdata.getallMerchentsData);
router.get('/merchant/getmerchantDatabyId/:merchantDataId', merchentdata.getmerchantDatabyId);
router.post('/merchant/updatemerchantData', merchentdata.updatemerchantData);
router.post('/merchant/merchantStatusToggle', merchentdata.merchantStatusToggle);
router.delete('/merchant/deletemerchantData/:merchantDataId/:userId/:name', merchentdata.deletemerchantData);

var faqdata = require('./controllers/faq/faq.controller');
router.post('/faq/addfaqData', faqdata.addfaqData);
router.get('/faq/getAllfaqs', faqdata.getAllfaqs);
router.post('/faq/addFaqAnswerByAdmin', faqdata.addFaqAnswerByAdmin);

module.exports = router;