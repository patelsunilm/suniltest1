var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CountriesSchema = new Schema({
    
    id : Number,
    countryname: String,
    name:String,
    iso3 : String,
    iso2 : String,
    phone_code : String,
    capital : String,
    currency : String
})
// set up a mongoose model

module.exports = mongoose.model('countries', CountriesSchema);