(function () {
    'use strict';

    module.exports = init;

    function init() {
        return {
            AdminController: require('./admin.controller'),
            AdminMiddleware: require('./admin.middleware'),
            AdminService: require('./admin.service'),
            AdminModel: require('./admin.model')
        }
    }
})();
