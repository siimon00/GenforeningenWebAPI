(function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var ReviewEventSchema = new Schema({
        title: String,
        date: Date,
        description: String,
        location: String,
        targetGroupMin: Number,
        targetGroupMax: Number,
        externLink: String,
        imageId: String,
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

    module.exports = mongoose.model('review_event', ReviewEventSchema);
})();