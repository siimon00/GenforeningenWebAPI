(function () {
    'use strict';

    var jwt = require('jsonwebtoken');
    var jwt_config = require('../../jwt_config/config');
    //var expressJwt = require('express-jwt');
    var cookieParser = require('cookie-parser');

    module.exports = {
        findUser: findUser,
        signup: signup
    };

    // instance of UserService to handle db interactions
    var UserService = require('./user.module')().UserService;

    function findUser(req, res, next) {
        let cookie = req.cookies.GenforeningenCookie;
        if (cookie !== undefined) {
            UserService.findUser(req.cookies.GenforeningenCookie)
                .then(success)
                .catch(failure);
        } else {
            // no cookie in request
            // user should be able to simply resend request
            next();
        }

        function success(data) {
            req.response = data;
            next();
        }
        function failure(err) {
            next(err);
        }
    }

    function signup(req, res, next) {
        let cookie = req.cookies.GenforeningenCookie;
        if (cookie !== undefined) {
            UserService.signup(req.cookies.GenforeningenCookie, req.params.eventId)
                .then(success)
                .catch(failure);
        } else {
            // no cookie in request
            // user should be able to simply resend request
            next();
        }

        function success(data) {
            req.response = data;
            next();
        }

        function failure(err) {
            next(err);
        }
    }
})();