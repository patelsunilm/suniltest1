var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TilldetailSchema = new Schema({

    primaryId: ObjectId,
    name: String,
    merchantId: ObjectId,
    secondary: [{

        name: { type: String },
        tertiary: [{
           
            name: { type: String }
        }]
    }],
    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date, default: Date.now }

})

// set up a mongoose model
module.exports = mongoose.model('tilldetails', TilldetailSchema);