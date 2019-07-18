var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FaqSchema = new Schema({
    userId:ObjectId,
    faqquestion:String,
    faqanswer:String,
    status: Boolean,
    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date, default: Date.now },

})
// set up a mongoose model

module.exports = mongoose.model('faq', FaqSchema);