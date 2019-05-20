(function () {
    'use strict';
    var express = require('express');
    var router = express.Router();

    var jwt = require('jsonwebtoken');
    var jwt_config = require('../../jwt_config/config');
    //var expressJwt = require('express-jwt');

    // instance of AdminMiddleware to handle requests
    var AdminMiddleware = require('./admin.module')().AdminMiddleware;

    // GET ALL admins
    router.get('/',
        // callback function one 
        AdminMiddleware.getAll,
        // callback function two
        function (req, res) {
            console.debug("in controller get");

            // if req.response was set in the previous callback
            // the request was authorized and the query resolved successfully
            if(req.response){
                res.status(200).json(req.response);
            } else {
                res.status(401).send();
            }
        });

    // login
    router.post('/login',
        // callback function one
        AdminMiddleware.login,
        // callback function two
        function (req, res) {
            console.debug("in controller login post");

            // if the query was successfull 
            // req.response was set in the previous callback
            if(req.response){
                // sign a token with the username and name of the admin
                let token = jwt.sign({ username: req.response.username, name: req.response.name }, 
                                        jwt_config.secret,
                                        {expiresIn: '1h'});
                
                res.status(200).send({token});
            } else {
                // unauthorized 
                res.status(401).send();
            }           
        });
    module.exports = router;
})();
