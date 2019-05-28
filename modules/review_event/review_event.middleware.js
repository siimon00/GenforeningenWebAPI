(function () {
    'use strict';

    module.exports = {
        getFifty: getFifty,
        createReviewEvent: createReviewEvent,
        approveReviewEvent: approveReviewEvent,
        deleteReviewEvent: deleteReviewEvent,
        getFiftyByDateAsc: getFiftyByDateAsc,
        getFiftyByDateDesc: getFiftyByDateDesc        
    };

    // instance of ReviewEventService to handle db interactions
    var ReviewEventService = require('./review_event.module')().ReviewEventService;
    // instance of EventService to be able to 'approve' ReviewEvents, which is basically just moving them to an Event document
    var EventService = require('../event/event.module')().EventService;

    function getFifty(req, res, next) {

        ReviewEventService.getFifty(req.query.position, req.query.search_string)
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

    function createReviewEvent(req, res, next) {
        
        ReviewEventService.createReviewEvent(
            req.body.title,
            req.body.date,
            req.body.description,
            req.body.location,
            req.body.targetGroupMin,
            req.body.targetGroupMax,
            req.body.externLink,
            req.body.imageId,
            req.body.eventContact)
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

    function approveReviewEvent(req, res, next){
        ReviewEventService.getReviewEvent(req.params.id)
            .then(getEventSuccess)
            .catch(failure);
        
        function getEventSuccess(data){
            let newEvent = {
                title: data.title,
                date: data.date,
                description: data.description,
                location: data.location,
                targetGroupMin: data.targetGroupMin,
                targetGroupMax: data.targetGroupMax,
                imageId: data.imageId,
                externLink: data.externLink,
                signups: 0,
                status: 'Active',
                eventContact: data.eventContact
            };
            EventService.createEvent(newEvent)
                .then(createEventSuccess)
                .catch(failure);
        }

        function createEventSuccess(data){
            req.response = data;
            ReviewEventService.deleteReviewEvent(req.params.id)
                .then(success)
                .catch(failure);
        }

        function success(data){
            next();
        }

        function failure(err){
            next(err);
        }
    }

    function deleteReviewEvent(req, res, next){
        ReviewEventService.deleteReviewEvent(req.params.id)
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

        ReviewEventService.getFiftyByDateAsc(req.query.position, req.query.search_string, req.query.date)
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

        ReviewEventService.getFiftyByDateDesc(req.query.position, req.query.search_string, req.query.date)
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