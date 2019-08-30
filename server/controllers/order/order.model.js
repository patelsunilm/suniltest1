var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var OrderDetailsSchema = new Schema({

  userId: ObjectId,
  status: String,
  merchantId: ObjectId,
  productdetails: [{

    productId: { type: ObjectId },
    quantity: { type: Number },
    image: { type: String },
    productName: { type: String },
    costPrice: { type: String },
    markUp: { type: Number },
    sellingPrice: { type: Number },
    merchantId: { type: ObjectId },
    barcode: { type: String }
  }],

  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})


module.exports = mongoose.model('orders', OrderDetailsSchema);