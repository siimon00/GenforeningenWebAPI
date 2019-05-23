(function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var UserSchema = new Schema({
        //cookieValue: String,
        eventIds: Array
    });
    module.exports = mongoose.model('user', UserSchema);
})();