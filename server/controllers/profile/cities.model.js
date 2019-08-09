var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CitiesSchema = new Schema({

    cityname: String,
})
// set up a mongoose model

module.exports = mongoose.model('cities', CitiesSchema);