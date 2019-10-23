var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DiarySchema = new Schema({
   
    title : String,
    notes: String,
    startDate : String,
    endDate : String,
    merchantId : ObjectId,
    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date, default: Date.now },

})
// set up a mongoose model

module.exports = mongoose.model('diary', DiarySchema);