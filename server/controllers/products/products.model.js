var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductsSchema = new Schema({
  id : ObjectId,
  productcatid : ObjectId,
  image:String,
  productname: String,
  costprice: Number,
  markup: Number,
  sellingprice: Number,
  date:Date,
  tilltype:String,
  tillTypeId: ObjectId,
  stocklevel:Number,
  merchantid : String,
  barcode : String,
  tillMovement : [{
    
    from :  { type : String},
    to : { type : String },
    stock: { type : String },
    fromStock : { type : String },
    moveStock : { type : String },
    fromId : { type : ObjectId },
    toId : { type : ObjectId},
    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date, default: Date.now }
  }],

  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('products', ProductsSchema);