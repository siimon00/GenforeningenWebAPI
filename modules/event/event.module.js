(function () {
    'use strict';

    module.exports = init;

    function init() {
        return {
            EventController: require('./event.controller'),
            EventMiddleware: require('./event.middleware'),
            EventService: require('./event.service'),
            EventModel: require('./event.model')
        }
    }
})();
