var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({

  image: String,
  backgroundImage : String,
  name: String,
  address: String,
  userType: String,
  email: String,
  password: String,
  businessname:  String ,
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
  userRatings : [{
    rating : { type : Number},
    comment :{ type : String },
    userId : { type : ObjectId},
 }],
  // otp :String,
  // DeviceToken: String,
  // DeviceType: String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now },
  flag:Number,
  flagTime: { type: Date}
})
// set up a mongoose model

module.exports = mongoose.model('users', UserSchema);