(function () {
    'use strict';  

    var jwt = require('jsonwebtoken');
    var jwt_config = require('../../jwt_config/config');
    //var expressJwt = require('express-jwt');
    var cookieParser = require('cookie-parser');

    module.exports = {
        findUser: findUser,
        //saveUser: saveUser
     //   deleteUser: deleteUser
    };

    // instance of UserService to handle db interactions
    var UserService = require('./user.module')().UserService;

    function findUser(req, res, next){
        console.debug("in user middleware find");
        let cookie = req.cookies.GenforeningenCookie;
        if(cookie !== undefined){
            UserService.findUser(req.body.cookieValue)
                .then(success)
                .catch(failure);
        } else {
            next();
        }

        function success(data){
            req.response = data;
            next();
        }
        function failure(err){
            next(err);
        }   
    }

    function saveUser(user){
        UserService.saveUser(user)
            .then(success)
            .catch(failure);

        function success(data){
            req.response = data;
        }

        function failure(err){
            req.response = err;
        }
    }
})();