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
  businessname:  { type : String , unique : true  } ,
  secretquestion: String,
  secretanswer: String,
  ipaddress: String,
  status: Boolean,
  phone:String,
  uniqueid: Number,
  backgroundtheme: String,
  fontcolor: String,
  googleid: String,
  facebookid: String,
  authToken: String,
  merchantcatid: ObjectId,
  countryid: Number,
  stateid: Number,
  cityid: String,    
  idToken: String,
  
  // otp :String,
  // DeviceToken: String,
  // DeviceType: String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})
// set up a mongoose model

module.exports = mongoose.model('users', UserSchema);