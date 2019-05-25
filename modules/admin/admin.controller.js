(function () {
    'use strict';
    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');

    var jwt = require('jsonwebtoken');
    var jwt_config = require('../../jwt_config/config');
    //var expressJwt = require('express-jwt');

    // instance of AdminMiddleware to handle requests
    var AdminMiddleware = require('./admin.module')().AdminMiddleware;

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

    // GET ALL admins
    router.get('/',
        // callback function one 
        authorization,
        // callback function two
        // handle backend stuff
        AdminMiddleware.getAll,
        // callback function three
        function (req, res) {
            console.debug("in controller get");

            // if req.response was set in the previous callback
            // the request was authorized and the query resolved successfully
            if (req.response) {
                res.status(200).json(req.response);
            } else {
                res.status(401).send();
            }
        });

    // CREATE an admin
    router.post('/',
        // callback function one
        authorization,
        // check that request body is as expected 
        function (req, res, next) {
            if (req.body.username && req.body.password && req.body.name) {
                next();
            } else {
                res.status(400).send();
            }
        },
        // callback function three
        AdminMiddleware.createAdmin,
        // callback function four
        function (req, res) {
            if (req.response) {
                if (req.response === 'username_exists') {
                    res.status(409).send({ error: 'username_exists' });
                } else {
                    res.status(201).send(req.response);
                }
            } else {
                res.status(400).send();
            }
        });

    // DELETE an admin
    router.delete('/:id',
        // callback function one
        authorization,
        // check that request params is as expected
        function (req, res, next) {
            try {
                let objectId = mongoose.Types.ObjectId(req.params.id);
                next();
            } catch(err){
                res.status(400).send();
            }          
        },
        // callback function three
        AdminMiddleware.deleteAdmin,
        // callback function four
        function (req, res) {
            // check if middleware could process the request 
            if (req.response) {
                if (req.response === 'not_allowed') {
                    res.status(403).send();
                } else if (req.response === 'not_found') {
                    res.status(404).send();
                } else {
                    res.status(200).send(req.response);
                }
            } else {
                // shouldn't happen but jic
                res.status(404).send();
            }
        });

    // login
    router.post('/login',
        // callback function one
        AdminMiddleware.login,
        // callback function two
        function (req, res) {
            //console.debug("in controller login post");

            // if the query was successfull 
            // req.response was set in the previous callback
            if (req.response) {
                // sign a token with the username and name of the admin
                let token = jwt.sign({ username: req.response.username, name: req.response.name },
                    jwt_config.secret,
                    { expiresIn: '1h' });

                res.status(200).send({ token });
            } else {
                // unauthorized 
                res.status(401).send();
            }
        });
    module.exports = router;
})();
