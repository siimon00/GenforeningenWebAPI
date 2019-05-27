(function () {
    'use strict';

    var mongoose = require('mongoose');

    module.exports = {
        getFileData: getFileData
    };

    // instance of ReviewEventModel for mongoose interactions
    var ImageModel = require('./image.module')().ImageModel;

    function getFileData(id) {
        return ImageModel.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();
    }
})();