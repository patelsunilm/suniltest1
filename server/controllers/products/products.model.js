var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductsSchema = new Schema({
 
 
  userid : ObjectId,
  image:String,
  productname: String,
  costprice: String,
  markup: Number,
  sellingprice: Number,
  date:Date,
  tilltype:String,
  stocklevel:String,
  uniqueid : Number,
  image: String,
  barcode : String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('products', ProductsSchema);