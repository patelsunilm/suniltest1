var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SignupSchema = new Schema({
  name: String,
  email: String,
  password: String,
  address:String,
  businessname: String,
  secretquestion : String,
  secretanswer: String,
  ipaddress: String,
  status: Boolean,
  uniqueid : Number,
  usertype: String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('signup', SignupSchema);