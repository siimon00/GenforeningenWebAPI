(function () {
    'use strict';

    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');

    var jwt = require('jsonwebtoken');
    var jwt_config = require('../../jwt_config/config');

    // instance of EventMiddleware to handle requests
    var ReviewEventMiddleware = require('./review_event.module')().ReviewEventMiddleware;

    // Authorization function
    function authorization(req, res, next) {
        // Need authorization before calling service method
        let header = req.headers['authorization'];

        //console.debug(header);
        // check for authorization header
        if (header && header.startsWith('Bearer ')) {
            // verify JSON Web Token
            jwt.verify(header.split(' ')[1], jwt_config.secret, (err, decodedToken) => {
                if (err) {
                    // if error happened - token somehow invalid
                    // send unauthorized and error
                    res.status(401).send(err);
                } else {
                    // token valid
                    // call next
                    next();
                }
            });
        } else {
            res.status(401).send();
        }
    }

    // GET 50 review_events from position set in body
    router.get('/',
        authorization,
        ReviewEventMiddleware.getReviewEvents,
        function (req, res) {
            res.status(200).json(req.response);
        });

    // GET number of review_events
    router.get('/count',
        authorization,
        ReviewEventMiddleware.count,
        function (req, res) {
            res.status(200).json(req.response);
        });

    // GET a review_event
    router.get('/:id',
        authorization,
        function (req, res, next) {
            try {
                let objectId = mongoose.Types.ObjectId(req.params.id);
                next();
            } catch (err) {
                res.status(400).send();
            }
        },
        ReviewEventMiddleware.getReviewEvent,
        function (req, res) {
            if (req.response) {
                res.status(200).json(req.response);
            } else {
                res.status(404).send();
            }
        });

    // POST a new review_event
    router.post('/',
        function (req, res, next) {
            if (req.body.title && req.body.date && req.body.description && req.body.location &&
                req.body.targetGroupMin && req.body.targetGroupMax && req.body.imageId &&
                req.body.eventContact && req.body.eventContact.name && req.body.eventContact.email && req.body.eventContact.phone) {

                let tryDate = new Date(req.body.date);
                if (!isNaN(tryDate)) {
                    next();
                } else {
                    res.status(400).json({ error: 'bad_date' });
                }
            } else {
                res.status(400).send();
            }
        },
        ReviewEventMiddleware.createReviewEvent,
        function (req, res) {
            res.status(200).json(req.response);
        });

    // DELETE a review_event
    router.delete('/:id',
        authorization,
        ReviewEventMiddleware.deleteReviewEvent,
        function (req, res) {
            res.status(200).json(req.response);
        });

    // approve a review_event
    // this will create a new event with status 'Active' and delete the review_event
    router.put('/approve/:id',
        authorization,
        ReviewEventMiddleware.approveReviewEvent,
        function (req, res) {
            res.status(200).json(req.response);
        });

    module.exports = router;

})();