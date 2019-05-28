(function () {
    'use strict';

    module.exports = init;

    function init() {
        return {
            BaseConfig: require('./base.config'),
            CommonModel: require('./common.model')            
        }
    }
})();
