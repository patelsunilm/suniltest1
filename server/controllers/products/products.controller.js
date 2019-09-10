var express = require('express');
var router = express.Router();

var productservice = require('./../../services/products.service')



exports.addproduct = function(req, res) {

    productservice.addproduct(req.body)
    .then(function (addproductdata) {

        if (addproductdata) {

            res.send(addproductdata);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });


}


exports.getAllproducts = function(req, res) {

 
    productservice.getAllproducts(req.body)
    .then(function (getproductdata) {
        if (getproductdata) {

            res.send(getproductdata);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}


exports.deleteproduct = function(req, res) {
    
    
    productservice.deleteproduct(req.params.productid)
    .then(function (data) {
           
        res.json(data);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.getallproductbyId = function(req, res) {

    productservice.getallproductbyId(req.params.productid)
    .then(function (getproduct) {
        if (getproduct) {
            res.send(getproduct);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.updateprodcutdetail = function(req, res) {
 
    productservice.updateprodcutdetail(req.body)
    .then(function (getproduct) {
        if (getproduct) {
            res.send(getproduct);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}


exports.getbarcodedetail = function(req, res) {

    productservice.getbarcodedetail(req.body)
   
    .then(function (getproduct) {
        if (getproduct) {
            res.send(getproduct);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}

exports.getAllProductcategories = function(req, res) {


    productservice.getAllProductcategories(req.body)
   
    .then(function (getproduct) {
        if (getproduct) {
            res.send(getproduct);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
    

}


exports.getproducts = function(req, res) {
   
    productservice.getproducts(req.params.userid)
   
    .then(function (getproduct) {
        if (getproduct) {
            res.send(getproduct);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}


exports.addproductcategories = function(req , res) {

  
    productservice.addproductcategories(req.params.catname,req.params.merchantId)
    .then(function (addproductcategory) {

        if (addproductcategory) {

            res.send(addproductcategory);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}



exports.addtocart = function(req, res) {
   
    productservice.addtocart(req.body)
    .then(function (addtocart) {

        if (addtocart) {

            res.send(addtocart);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}


exports.RemoveCart = function(req, res) {

    productservice.RemoveCart(req.body)
    .then(function (Removecart) {

        if (Removecart) {

            res.send(Removecart);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });  
}


exports.getCategoriesProducts = function(req , res) {
   
    productservice.getCategoriesProducts(req.body)
    .then(function (getproduct) {

        if (getproduct) {

            res.send(getproduct);

        } else {

            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}