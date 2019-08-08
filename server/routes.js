var express = require('express');
var router = express.Router();




var dashboards = require('./controllers/dashboards/dashboard.controller');
router.get('/dashboard/getAllcountsproducts/:userId', dashboards.getAllcountsproducts);
router.get('/dashboard/getAllcountfaqs/:userId', dashboards.getAllcountfaqs);



var profiledata = require('./controllers/profile/profile.controller');
router.get('/profile/getprofileInfo/:userId', profiledata.getprofileInfo);
router.post('/profile/updateprofile', profiledata.updateprofile);
router.get('/profile/getcountries' , profiledata.getcountries);
router.get('/profile/getstates/:stateid' , profiledata.getstates);
router.get('/profile/getcity/:cityid' , profiledata.getcity);
router.post('/profile/getuserprofile' , profiledata.getuserprofile);


var passworddata = require('./controllers/password/password.controller');
router.post('/password/passwordmatch', passworddata.passwordmatch);


var productsdata = require('./controllers/products/products.controller');

router.post('/products/addproduct', productsdata.addproduct);
router.get('/products/getproducts/:userid',productsdata.getproducts);
router.delete('/products/deleteproduct/:productid', productsdata.deleteproduct);
router.get('/products/getallproductbyId/:productid', productsdata.getallproductbyId);
router.post('/products/updateprodcutdetail', productsdata.updateprodcutdetail);
router.post('/products/getAllproducts', productsdata.getAllproducts);
router.post('/products/getbarcodedetail' ,productsdata.getbarcodedetail);

router.get('/products/getAllProductcategories' ,productsdata.getAllProductcategories);

router.get('/products/addproductcategories/:catname' ,productsdata.addproductcategories);

// /products/addproductcategories
var merchentdata = require('./controllers/merchant/merchant.controller');
router.get('/merchant/getallMerchentsData', merchentdata.getallMerchentsData);
router.get('/merchant/getmerchantDatabyId/:merchantDataId', merchentdata.getmerchantDatabyId);
router.post('/merchant/updatemerchantData', merchentdata.updatemerchantData);
router.post('/merchant/merchantStatusToggle', merchentdata.merchantStatusToggle);
router.delete('/merchant/deletemerchantData/:merchantDataId/:userId/:name', merchentdata.deletemerchantData);
router.get('/merchant/getMerchentsbyId/:catid', merchentdata.getMerchentsbyId);

var faqdata = require('./controllers/faq/faq.controller');
router.post('/faq/addfaqData', faqdata.addfaqData);
router.get('/faq/getAllfaqs/:userId/:userType', faqdata.getAllfaqs);
router.post('/faq/addFaqAnswerByAdmin', faqdata.addFaqAnswerByAdmin);



var appusersdetails = require('./controllers/appusers/appusers.controller');

router.get('/appusers/GetallUsersDetails', appusersdetails.GetallUsersDetails);
router.delete('/appusers/deleteappuser/:userid', appusersdetails.deleteappuser);
router.get('/appusers/getuserbyId/:userid', appusersdetails.getuserbyId);
router.post('/appusers/updateuserdetails' , appusersdetails.updateuserdetails)

module.exports = router;