(function () {
    var mongoose = require('mongoose');
    var BaseConfig = require('../common/common.module')().BaseConfig;
    var CommonModel = require('../common/common.module')().CommonModel;    

    var Schema = mongoose.Schema;

    const EventCommon = CommonModel.discriminator('EventType', new Schema({
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
    }, BaseConfig));

    module.exports = EventCommon;
})();