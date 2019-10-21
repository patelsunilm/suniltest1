var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CartdetailsSchema = new Schema({

    userId: ObjectId,
    status : String,
    productdetails: [{
     
        productId: { type: ObjectId },
        quantity : { type : Number },
        image : {type : String},
        productName : {type : String},
        costPrice : { type : String},
        markUp : { type : Number} ,
        sellingPrice : {type : Number},
        merchantId : { type :ObjectId },
        barcode : {type : String},
        tillTypeId : { type : ObjectId}        
       
    }],

    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date, default: Date.now }
})


module.exports = mongoose.model('cartdetails', CartdetailsSchema);