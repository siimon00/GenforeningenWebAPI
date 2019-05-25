(function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var EventSchema = new Schema({
        title: String,
        date: Date,
        description: String,
        location: String,
        signups: Number,
        targetGroupMin: Number,
        targetGroupMax: Number,
        imageId: String,
        externLink: String,
        status: String,
        eventContact: { name: String, email: String, phone: String }
    });

    /* AdminSchema.set('toJSON', {
         transform: function(doc, ret, options) {
             var returnJSON = {
                 username: ret.username,
                 name: ret.name
             };
             return returnJSON;
         }
     });
     */

    module.exports = mongoose.model('event', EventSchema);
})();