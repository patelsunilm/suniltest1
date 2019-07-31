var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({

  image: String,
  name: String,
  address: String,
  userType: String,
  email: String,
  password: String,
  businessname: String,
  secretquestion: String,
  secretanswer: String,
  ipaddress: String,
  status: Boolean,
  phone:String,
  uniqueid: Number,
  backgroundtheme: String,
  fontcolor: String,
  googleid: String,
  authToken: String,
  otp :String,
  merchantcatid: ObjectId,
  countriid: Number,
  stateid: Number,
  cityid:Number,    
  idToken: String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('users', UserSchema);