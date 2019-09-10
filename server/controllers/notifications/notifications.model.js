var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var notificationsSchema = new Schema({

  users: [ {
    userId: {type : ObjectId}
  }],
  message: String,
  dateadded: { type: Date, default: Date.now },
  datemodified: { type: Date, default: Date.now }
})

// secondary: [{

//     name: { type: String },
//     tertiary: [{
       
//         name: { type: String }
//     }]
// }],

module.exports = mongoose.model('notifications', notificationsSchema);