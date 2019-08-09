var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({

  firstname: String,
  lastname:String,
  image: String,
  email: String,
  phone: String,
  status: Boolean,
  merchantid:String,
  otp: String,
  userType: String,
  deviceToken: String,
  deviceType: String,

  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('appusers', UserSchema);