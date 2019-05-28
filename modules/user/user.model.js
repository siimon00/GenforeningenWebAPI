(function () {
    var mongoose = require('mongoose');
    var BaseConfig = require('../common/common.module')().BaseConfig;
    var CommonModel = require('../common/common.module')().CommonModel;    

    var Schema = mongoose.Schema;

    var UserCommon = CommonModel.discriminator('UserType', new Schema({
        //cookieValue: String,
        eventIds: Array
    }, BaseConfig));
    
    module.exports = UserCommon;
})();