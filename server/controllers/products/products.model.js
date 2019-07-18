var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductsSchema = new Schema({
 
  productname: String,
  costprice: String,
  markup: Number,
  sellingprice: Number,
  date:Date,
  tilltype:String,
  stocklevel:String,
  uniqueid : Number,
  image: String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('products', ProductsSchema);