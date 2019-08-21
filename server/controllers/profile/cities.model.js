var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CitiesSchema = new Schema({
    
    id : Number,
    name: String,
})
// set up a mongoose model

module.exports = mongoose.model('cities', CitiesSchema);