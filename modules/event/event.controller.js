(function () {
    'use strict';
    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');

    var jwt = require('jsonwebtoken');
    var jwt_config = require('../../jwt_config/config');

    // instance of EventMiddleware to handle requests
    var EventMiddleware = require('./event.module')().EventMiddleware;

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

    // GET 50 events from position set in body
    router.get('/',
        EventMiddleware.getEvents,
        function (req, res) {
            res.status(200).json(req.response);
        });

    // GET number of events
    router.get('/count',
        EventMiddleware.count,
        function (req, res) {
            res.status(200).json(req.response);
        });  

    // GET an event
    router.get('/:id',
        function (req, res, next) {
            try {
                let objectId = mongoose.Types.ObjectId(req.params.id);
                next();
            } catch (err) {
                res.status(400).send();
            }
        },
        EventMiddleware.getEvent,
        function (req, res) {
            if (req.response) {
                res.status(200).json(req.response);
            } else {
                res.status(404).send();
            }
        });

    // sets an events status to inactive
    router.delete('/:id',
        authorization,
        EventMiddleware.deleteEvent,
        function (req, res) {
            res.status(200).json(req.response);
        });

    module.exports = router;
})();
