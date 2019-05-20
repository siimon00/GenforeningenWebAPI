(function () {
    'use strict';  

    var jwt = require('jsonwebtoken');
    var jwt_config = require('../../jwt_config/config');
    //var expressJwt = require('express-jwt');

    module.exports = {
        login: login,
        getAll: getAll,
     //   deleteUser: deleteUser
    };

    // instance of AdminService to handle db interactions
    var AdminService = require('./admin.module')().AdminService;

    // function to handle request to get list of all admins
    function getAll(req, res, next) {
        console.debug("in middleware testmethod");

        let header = req.headers['authorization'];

        console.debug(header);

        // check for authorization header
        if(header && header.startsWith('Bearer ')){
            // verify JSON Web Token
            jwt.verify(header.split(' ')[1], jwt_config.secret, (err, decodedToken) => {
                if(err){
                    // if error happened - token somehow invalid
                    // send unauthorized and error
                    res.status(401).send(err);
                } else {
                    // token valid
                    // call AdminService.getAll
                    AdminService.getAll()
                        .then(success)
                        .catch(failure);                   
                }
            });
        } else {
            // if no header - go to next callback function
            next();
        }
        
        function success(data) {
            console.debug("in middleware testmethod success");
            req.response = data;
            next();
        }

        function failure(error) {
            console.debug("in middleware testmethod failure");
            next(error);
        }    
    }

    // function to handle login requests
    function login(req, res, next) {

        console.debug("in middleware login");

        // call adminservice.login which returns a promise
        // that resolves to an admin with the corresponding username and password that was given
        // in the request
        AdminService.login(req.body)
            .then(success)
            .catch(failure);

        // on successfull query
        function success(data) {
            console.debug("in middleware login success");
            // set req.response to the returned data
            // for the next callback function
            req.response = data;
            next();
        }

        // on error
        function failure(error) {            
            console.debug("in middleware login failure");
            // skip next callback and send error
            next(error);
        }
    }   
})();
