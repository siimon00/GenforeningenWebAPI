(function () {
    'use strict';
    var express = require('express');
    var router = express.Router();

    var UserMiddleware = require('./user.module')().UserMiddleware;

    // details returns the eventid's that the current user is signed up for
    router.get('/events',
        UserMiddleware.findUser,
        function (req, res) {
            if (req.response) {
                res.status(200).json(req.response.eventIds);
            } else {
                // no cookie in request - user should simply be able to resend request
                // send bad request
                res.status(400).send();
            }
        });

    router.get('/signup/:eventId',
        UserMiddleware.findUser,
        function (req, res, next) {
            if (req.response) {
                next();
            } else {
                // no cookie in request - user should simply be able to resend request
                // send bad request
                res.status(400).send();
            }
        },
        UserMiddleware.signup,
        function (req, res) {
            res.status(200).json(req.response);
        });

    module.exports = router;
})();