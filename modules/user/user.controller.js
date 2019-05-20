(function () {
    'use strict';
    var express = require('express');
    var router = express.Router();

    var UserMiddleware = require('./user.module')().UserMiddleware;

    module.exports = router;
})();