(function () {
    var mongoose = require('mongoose'); 
    var Schema = mongoose.Schema;

    var AdminSchema = new Schema({
        username: String,
        password: String,
        name: String
    });
    module.exports = mongoose.model('admin', AdminSchema);
})();