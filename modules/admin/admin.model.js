(function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var AdminSchema = new Schema({
        username: String,
        password: String,
        name: String
    });

    AdminSchema.set('toJSON', {
        transform: function (doc, ret, options) {
            var returnJSON = {
                username: ret.username,
                name: ret.name
            };
            return returnJSON;
        }
    });

    module.exports = mongoose.model('admin', AdminSchema);
})();