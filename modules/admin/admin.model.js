(function () {
    var mongoose = require('mongoose');
    var BaseConfig = require('../common/common.module')().BaseConfig;
    var CommonModel = require('../common/common.module')().CommonModel;  

    var Schema = mongoose.Schema;

    var AdminSchema = new Schema({
        username: String,
        password: String,
        name: String
    }, BaseConfig);

    AdminSchema.set('toJSON', {
        transform: function (doc, ret, options) {
            var returnJSON = {
                username: ret.username,
                name: ret.name
            };
            return returnJSON;
        }
    });

    var AdminCommon = CommonModel.discriminator('AdminType', AdminSchema);   

    module.exports = AdminCommon;
})();