var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var chatSchema   = new Schema({

    toId: ObjectId,
    formId : ObjectId,
    message: String,
    time:String,
    type:String
    
    // message: {
    //     type: String
    //     },
    //     sender: {
    //     type: String
    //         }
    //     },
    //         {
    //     timestamps: true

})


// set up a mongoose model

module.exports = mongoose.model('Chat', chatSchema  );