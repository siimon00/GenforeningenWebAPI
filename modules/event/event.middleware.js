(function () {
    'use strict';

    module.exports = {
        count: count,
        getEvent: getEvent,
        getEvents: getEvents,      
        deleteEvent: deleteEvent
    };

    // instance of EventService to handle db interactions
    var EventService = require('./event.module')().EventService;

    function count(req, res, next) {

        EventService.count(req.query.search_string, req.query.date, req.query.descending)
            .then(success)
            .catch(failure);

        function success(data) {
            req.response = data;
            next();
        }

        function failure(err) {
            next(err);
        }
    }

    function getEvent(req, res, next) {
        EventService.getEvent(req.params.id)
            .then(success)
            .catch(failure);

        function success(data) {
            req.response = data;
            next();
        }
        function failure(err) {
            next(err);
        }
    }

    function getEvents(req, res, next) {

        EventService.getEvents(req.query.position, req.query.search_string, req.query.date, req.query.descending)
            .then(success)
            .catch(failure);


        function success(data) {
            req.response = data;
            next();
        }

        function failure(err) {
            next(err);
        }
    }

    function deleteEvent(req, res, next) {

        EventService.deleteEvent(req.params.id)
            .then(success)
            .catch(failure);

        function success(data) {
            req.response = data;
            next();
        }

        function failure(err) {
            next(err);
        }
    }

})();