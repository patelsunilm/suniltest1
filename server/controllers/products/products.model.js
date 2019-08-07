var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductsSchema = new Schema({
 
 
  id : ObjectId,
  image:String,
  productname: String,
  costprice: String,
  markup: Number,
  sellingprice: Number,
  date:Date,
  tilltype:String,
  stocklevel:String,
  merchantid : String,
  image: String,
  barcode : String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('products', ProductsSchema);