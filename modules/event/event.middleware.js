(function () {
    'use strict';

    module.exports = {
        getFifty: getFifty,
        getEvent: getEvent,
        getFiftyByDateAsc: getFiftyByDateAsc,
        getFiftyByDateDesc: getFiftyByDateDesc,
        deleteEvent: deleteEvent
    };

    // instance of EventService to handle db interactions
    var EventService = require('./event.module')().EventService;

    function getFifty(req, res, next) {

        EventService.getFifty(req.query.position, req.query.search_string)
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

    function getEvent(req, res, next){
        EventService.getEvent(req.params.id)
            .then(success)
            .catch(failure);

        function success(data){
            req.response = data;
            next();
        }
        function failure(err){
            next(err);
        }
    }

    function getFiftyByDateAsc(req, res, next) {

        EventService.getFiftyByDateAsc(req.query.position, req.query.search_string, req.query.date)
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

    function getFiftyByDateDesc(req, res, next) {

        EventService.getFiftyByDateDesc(req.query.position, req.query.search_string, req.query.date)
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