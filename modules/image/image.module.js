(function () {
    'use strict';

    module.exports = init;

    function init() {
        return {
            ImageController: require('./image.controller'),
            ImageMiddleware: require('./image.middleware'),
            ImageService: require('./image.service'),
            ImageModel: require('./image.model')
        }
    }
})();