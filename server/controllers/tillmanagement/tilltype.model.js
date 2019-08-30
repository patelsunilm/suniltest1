var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TilltypeSchema = new Schema({

  tilltype: String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }

})

// set up a mongoose model

module.exports = mongoose.model('tilltypes', TilltypeSchema);