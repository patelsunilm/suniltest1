var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CountriesSchema = new Schema({

    countryname: String,
})
// set up a mongoose model

module.exports = mongoose.model('countries', CountriesSchema);