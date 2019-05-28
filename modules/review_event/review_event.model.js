(function () {
    var mongoose = require('mongoose');
    var BaseConfig = require('../common/common.module')().BaseConfig;
    var CommonModel = require('../common/common.module')().CommonModel;  

    var Schema = mongoose.Schema;

    var ReviewEventCommon = CommonModel.discriminator('ReviewEventType', new Schema({
        title: String,
        date: Date,
        description: String,
        location: String,
        targetGroupMin: Number,
        targetGroupMax: Number,
        externLink: String,
        imageId: String,
        eventContact: { name: String, email: String, phone: String }
    }, BaseConfig));

    module.exports = ReviewEventCommon;
})();