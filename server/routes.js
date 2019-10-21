var express = require('express');
var router = express.Router();

var dashboards = require('./controllers/dashboards/dashboard.controller');
router.get('/dashboard/getAllusercount', dashboards.getAllusercount);
router.get('/dashboard/getAllcountfeedback', dashboards.getAllcountfeedback);
router.get('/dashboard/getAllmerchantcounts', dashboards.getAllmerchantcounts);
router.get('/dashboard/getAllcountproducts/:userId', dashboards.getAllcountproducts);
router.get('/dashboard/getAllcountfaqs/:userId', dashboards.getAllcountfaqs);

var profiledata = require('./controllers/profile/profile.controller');
router.get('/profile/getprofileInfo/:userId', profiledata.getprofileInfo);
router.post('/profile/updateprofile', profiledata.updateprofile);
router.get('/profile/getcountries', profiledata.getcountries);
router.post('/profile/getstates', profiledata.getstates);
router.post('/profile/getcity', profiledata.getcity);
router.post('/profile/getuserprofile', profiledata.getuserprofile);
router.get('/profile/getAllcountries', profiledata.getAllcountries);
router.post('/profile/getallstates', profiledata.getallstates);
router.post('/profile/getallcity', profiledata.getallcity);


var passworddata = require('./controllers/password/password.controller');
router.post('/password/passwordmatch', passworddata.passwordmatch);


var productsdata = require('./controllers/products/products.controller');
router.post('/products/addproduct', productsdata.addproduct);
router.get('/products/getproducts/:userid', productsdata.getproducts);
router.delete('/products/deleteproduct/:productid', productsdata.deleteproduct);
router.get('/products/getallproductbyId/:productid', productsdata.getallproductbyId);
router.post('/products/updateprodcutdetail', productsdata.updateprodcutdetail);
router.post('/products/getAllproducts', productsdata.getAllproducts);
router.post('/products/getbarcodedetail', productsdata.getbarcodedetail);
router.post('/products/getAllProductcategories', productsdata.getAllProductcategories);
router.get('/products/addproductcategories/:catname/:merchantId', productsdata.addproductcategories);
router.post('/products/addtocart', productsdata.addtocart);
router.post('/products/RemoveCart', productsdata.RemoveCart);
router.post('/products/getCategoriesProducts' , productsdata.getCategoriesProducts);
router.post('/products/getproductdetailsbyid' , productsdata.getproductdetailsbyid);
router.post('/products/addproductrating' , productsdata.addproductrating);
router.post('/products/getproductrating' , productsdata.getproductrating);
router.post('/products/updateproductrating', productsdata.updateproductrating);
router.post('/products/getproductratingbyid', productsdata.getproductratingbyid);
router.post('/products/getProductsRatingDetails', productsdata.getProductsRatingDetails);
router.post('/products/getProductsRatingDetailsbyid',productsdata.getProductsRatingDetailsbyid);
router.post('/products/gettilldetails', productsdata.gettilldetails);

var merchentdata = require('./controllers/merchant/merchant.controller');
router.get('/merchant/getallMerchentsData', merchentdata.getallMerchentsData);
router.get('/merchant/getmerchantDatabyId/:merchantDataId', merchentdata.getmerchantDatabyId);
router.post('/merchant/updatemerchantData', merchentdata.updatemerchantData);
router.post('/merchant/merchantStatusToggle', merchentdata.merchantStatusToggle);
router.delete('/merchant/deletemerchantData/:merchantDataId/:userId/:name', merchentdata.deletemerchantData);
router.get('/merchant/getMerchentsbyId/:catid', merchentdata.getMerchentsbyId);
router.get('/merchant/getMerchantCategories', merchentdata.getMerchantCategories);
router.post('/merchant/getMerchantCategoriebyId', merchentdata.getMerchantCategoriebyId);
router.post('/merchant/SearchMerchant', merchentdata.SearchMerchant);


var faqdata = require('./controllers/faq/faq.controller');
router.post('/faq/addfaqData', faqdata.addfaqData);
router.get('/faq/getAllfaqs/:userId/:userType', faqdata.getAllfaqs);
router.post('/faq/addFaqAnswerByAdmin', faqdata.addFaqAnswerByAdmin);

var orderdata = require('./controllers/order/order.controller');
router.get('/order/getAllorders/:merchantId/:userType', orderdata.getAllorders);
router.get('/order/getAllproductorderdetails/:appuserId', orderdata.getAllproductorderdetails);
router.post('/order/verifyorder' , orderdata.verifyorder);
router.post('/order/createorder', orderdata.createorder);
router.post('/order/payment' , orderdata.payment);
router.post('/order/checkorderhistory' , orderdata.checkorderhistory);
router.post('/order/getqrcodedetails' , orderdata.getqrcodedetails)
router.post('/order/getProductsbydate' , orderdata.getProductsbydate);
router.post('/order/getProductsbyid' , orderdata.getProductsbyid);
router.post('/order/getnumberofcustomerpurchases' , orderdata.getnumberofcustomerpurchases);
router.post('/order/getproductratingcounts' , orderdata.getproductratingcounts);

router.post('/order/getvalueofcustomerpurchases' , orderdata.getvalueofcustomerpurchases);


var appusersdetails = require('./controllers/appusers/appusers.controller');
router.get('/appusers/GetallUsersDetails', appusersdetails.GetallUsersDetails);
router.delete('/appusers/deleteappuser/:userid', appusersdetails.deleteappuser);
router.get('/appusers/getuserbyId/:userid', appusersdetails.getuserbyId);
router.post('/appusers/updateuserdetails', appusersdetails.updateuserdetails);
router.post('/appusers/getCartDetails', appusersdetails.getCartDetails);
router.post('/appusers/UserLogout', appusersdetails.UserLogout);


var tillmanagement = require('./controllers/tillmanagement/tillmanagement.controller');
router.get('/tillmanagement/getalltillType', tillmanagement.getalltillType);
router.post('/tillmanagement/addtilldetails', tillmanagement.addtilldetails);
router.post('/tillmanagement/getAllsecondarytilltype', tillmanagement.getAllsecondarytilltype);
router.post('/tillmanagement/getTillManagementDetails', tillmanagement.getTillManagementDetails);
router.post('/tillmanagement/deletetilltypename', tillmanagement.deletetilltypename);
router.post('/tillmanagement/getTillnametbyId', tillmanagement.getTillnametbyId);
router.post('/tillmanagement/updatetilltypename', tillmanagement.updatetilltypename);



var notifications = require('./controllers/notifications/notification.controller');
router.post('/notifications/addnotification', notifications.addnotification);

module.exports = router;


