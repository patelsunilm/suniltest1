var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var merchantcategoriesSchema = new Schema({

    merchantcatname: String,
})
// set up a mongoose model

module.exports = mongoose.model('merchantcategories', merchantcategoriesSchema);