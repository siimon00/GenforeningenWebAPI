(function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var ImageSchema = new Schema({
        length: Number,
        chunkSize: Number,
        uploadDate: Object,
        filename: String,
        md5: String,
        contentType: String
    });
    module.exports = mongoose.model('image', ImageSchema, 'images.files');
})();
