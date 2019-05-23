(function () {
    'use strict';

    module.exports = init;

    function init() {
        return {
            ReviewEventController: require('./review_event.controller'),
            ReviewEventMiddleware: require('./review_event.middleware'),
            ReviewEventService: require('./review_event.service'),
            ReviewEventModel: require('./review_event.model')
        }
    }
})();
