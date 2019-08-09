var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var StatesSchema = new Schema({

    name: String,
    country_id: Number


})
// set up a mongoose model

module.exports = mongoose.model('states', StatesSchema);